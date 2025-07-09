require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const alertRoutes = require("./routes/alertRoutes");
const priceChecker = require("./cron/priceChecker");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(bodyParser.json());

// ✅ JSON parse error handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ error: "Invalid JSON" });
  }
  next();
});

// ----- Routes -----
app.post("/newHolding", async (req, res) => {
  try {
    const { name, qty, avg, price, net, day } = req.body;
    console.log("Received holding:", req.body);
    const newHolding = new HoldingsModel({ name, qty, avg, price, net, day });
    await newHolding.save();
    res.status(201).send("Holding saved!");
  } catch (err) {
    console.error("Error saving holding:", err);
    res.status(500).json({ error: "Error saving holding." });
  }
});

app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching holdings." });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching positions." });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const newOrder = new OrdersModel({ name, qty, price, mode });
    await newOrder.save();
    res.status(201).send("Order saved!");
  } catch (err) {
    res.status(500).json({ error: "Error saving order." });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({});
    res.json(allOrders);
  } catch (err) {
    res.status(500).send("Error fetching orders");
  }
});

app.delete("/deleteOrder/:id", async (req, res) => {
  try {
    await OrdersModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Order deleted");
  } catch (err) {
    res.status(500).send("Error deleting order");
  }
});

// 🆕 Price Alert Routes
app.use("/api/alerts", alertRoutes);

// ----- Connect to DB and Start Server -----
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    priceChecker(); // Start cron job
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

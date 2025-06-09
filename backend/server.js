const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors()); // Allow all origins - safe for dev, for prod configure properly

// API endpoint: /api/stock/:symbol
app.get("/api/stock/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

    // Fetch data from Yahoo Finance
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

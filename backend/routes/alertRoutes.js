const express = require("express");
const Alert = require("../model/AlertModel");
const fetchPrice = require("../utils/fetchPrice");

const router = express.Router();

// POST /api/alerts
router.post("/", async (req, res) => {
  try {
    const { symbol, targetPercent } = req.body;
    const basePrice = await fetchPrice(symbol);
    if (!basePrice) return res.status(400).json({ message: "Invalid stock symbol" });

    const alert = new Alert({ symbol, targetPercent, basePrice, currentPrice: basePrice });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: "Error creating alert" });
  }
});

// GET /api/alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching alerts" });
  }
});

module.exports = router;

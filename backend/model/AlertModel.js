const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  symbol: String,
  targetPercent: Number,
  currentPrice: Number,
  basePrice: Number,
  notified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Alert', alertSchema);

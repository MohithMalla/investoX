const { Schema } = require("mongoose");

const HoldingsSchema = new Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, required: true },
  price: { type: Number, required: true },
  net: { type: String }, // or change to Number if you want %
  day: { type: String }  // or change to Number if you want %
});

module.exports = { HoldingsSchema };

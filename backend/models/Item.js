const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  sno: { type: Number, required: true }, // Serial number
  name: { type: String, required: true }, // Name of the item
  partNumber: { type: String, required: true }, // Part number of the item
  dateReceived: { type: Date, required: true }, // Date when the item was received
  dateDispatch: { type: Date }, // Date when the item was dispatched
  balanceItems: { type: Number, required: true }, // Number of items in balance
  qrCode: { type: String, required: true, unique: true }, // Unique QR code
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;

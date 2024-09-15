const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const Item = require("../models/Item");

// Generate QR Code (POST)
router.post("/generateQR", async (req, res) => {
  const { sno, name, partNumber, dateReceived, balanceItems } = req.body;

  const newItem = new Item({
    sno,
    name,
    partNumber,
    dateReceived,
    balanceItems,
    qrCode: "",
  });

  try {
    const qrData = `S.No: ${sno}, Name: ${name}, Part Number: ${partNumber}, Date Received: ${dateReceived}, Balance Items: ${balanceItems}`;
    const qrCode = await QRCode.toDataURL(qrData);

    newItem.qrCode = qrCode;
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all items (GET)
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get item by ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update item and regenerate QR code (PUT)
router.put("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Regenerate QR code
    const qrData = `S.No: ${updatedItem.sno}, Name: ${updatedItem.name}, Part Number: ${updatedItem.partNumber}, Date Received: ${updatedItem.dateReceived}, Balance Items: ${updatedItem.balanceItems}`;
    const qrCode = await QRCode.toDataURL(qrData);
    console.log(qrCode);

    updatedItem.qrCode = qrCode;
    const newSavedItem = await updatedItem.save();

    res.json(newSavedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete item (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem)
      return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Scan QR Code (POST)

router.post("/scanQR", async (req, res) => {
  const { qrCodeData } = req.body;

  try {
    const dataParts = qrCodeData.split(", ");
    const itemData = {};
    dataParts.forEach((part) => {
      const [key, value] = part.split(": ");
      itemData[key.trim()] = value.trim();
    });

    const { "S.No": sno, "Balance Items": balanceItems } = itemData;

    // Find the item by serial number
    const item = await Item.findOne({ sno });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Subtract from balance items
    if (item.balanceItems > 0) {
      item.balanceItems = item.balanceItems - 1;

      // Regenerate QR code with updated balance items
      const updatedQRCodeData = `S.No: ${item.sno}, Name: ${item.name}, Part Number: ${item.partNumber}, Date Received: ${item.dateReceived}, Balance Items: ${item.balanceItems}`;

      // Generate new QR code
      const updatedQRCode = await QRCode.toDataURL(updatedQRCodeData);

      // Update the item's QR code
      item.qrCode = updatedQRCode;

      // Save the item with the updated balance and QR code
      await item.save();

      res.status(200).json({
        message: "Item updated and QR code regenerated successfully",
        item,
      });
    } else {
      res.status(400).json({ message: "No items left to subtract" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

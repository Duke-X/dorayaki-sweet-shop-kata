const express = require("express");
const Sweet = require("../models/Sweet");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const sweets = await Sweet.find();
  res.status(200).json(sweets);
});

router.post("/", authMiddleware, adminMiddleware, upload.single("image"), async (req, res) => {
  const { name, category, price, quantity } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  await Sweet.create({ name, category, price, quantity, imageUrl: req.file.path });

  res.status(201).json({ message: "Sweet added successfully" });
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  await Sweet.findByIdAndUpdate(id, req.body);

  res.status(200).json({ message: "Sweet updated successfully" });
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  await Sweet.findByIdAndDelete(id);

  res.status(200).json({ message: "Sweet deleted successfully" });
});

router.post("/:id/purchase", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const sweet = await Sweet.findById(id);

  if (!sweet) {
    return res.status(400).json({ message: "Sweet not found" });
  }
  if (quantity <= 0 || quantity > sweet.quantity) {
    return res.status(400).json({ message: "Insufficient stock" });
  }
  sweet.quantity -= quantity;
  await sweet.save();

  res.status(200).json({
    message: "Purchase successful",
    remainingQuantity: sweet.quantity,
  });
});

router.post("/:id/restock", authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const sweet = await Sweet.findById(id);

  if (!sweet) {
    return res.status(404).json({ message: "Sweet not found" });
  }

  if (quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  sweet.quantity += quantity;
  await sweet.save();

  res.status(200).json({
    message: "Sweet restocked",
    newQuantity: sweet.quantity,
  });
});

module.exports = router;

const express = require("express");
const Sweet = require("../models/Sweet");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");
const router = express.Router();

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const sweets = await Sweet.find();
  res.status(200).json(sweets);
});

router.post("/", authMiddleware, adminMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, quantity, imageUrl: bodyImageUrl } = req.body;

    const imageUrl = req.file ? req.file.path : bodyImageUrl;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Cloudinary storage automatically puts the url in req.file.path
    await Sweet.create({ name, category, price, quantity, imageUrl });

    res.status(201).json({ message: "Sweet added successfully" });
  } catch (error) {
    console.error("Add Sweet Error:", error);
    res.status(500).json({ message: "Failed to add sweet. Check server logs (Cloudinary keys?)." });
  }
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

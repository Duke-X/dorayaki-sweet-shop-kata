const express = require("express");
const Sweet = require("../models/Sweet");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  });

router.post("/", authMiddleware, adminMiddleware, async(req, res) => {
    const {name, category, price, quantity} = req.body;

    await Sweet.create({name, category, price, quantity});

    res.status(201).json({message: "Sweet added successfully"})
});

router.put("/:id", authMiddleware, adminMiddleware, async(req, res) => {
    const {id} = req.params;

    await Sweet.findByIdAndUpdate(id, req.body);

    res.status(200).json({message: "Sweet updated successfully"});
});

router.delete("/:id", authMiddleware, adminMiddleware, async(req, res) => {
    const {id} = req.params;

    await Sweet.findByIdAndDelete(id);

    res.status(200).json({message: "Sweet deleted successfully"});
});

module.exports = router;
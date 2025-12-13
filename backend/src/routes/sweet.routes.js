const express = require("express");
const Sweet = require("../models/Sweet");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  });
  
  module.exports = router;
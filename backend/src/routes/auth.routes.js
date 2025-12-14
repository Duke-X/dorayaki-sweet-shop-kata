const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check for Admin Secret
    // In a real app, store simple env var or verify properly.
    // KEY: "DORAYAKI_ADMIN_2025"
    let role = "user";
    if (adminKey === "DORAYAKI_ADMIN_2025") {
        role = "admin";
    }

    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // Generate REAL token so they are logged in immediately as admin/user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      message: role === "admin" ? "Admin account created!" : "Account created successfully"
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ 
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

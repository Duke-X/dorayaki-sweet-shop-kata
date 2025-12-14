const mongoose = require("mongoose");
require("dotenv").config();
const Sweet = require("../models/Sweet");
const connectDB = require("../config/db");

const seedSweets = async () => {
  try {
    await connectDB();

    const signatures = [
      {
        name: "Crossiant",
        price: 110,
        category: "Fusion",
        imageUrl: "/croissant.png",
        quantity: 20,
        description: "A buttery, flaky fusion delight."
      },
      {
        name: "Golden Peda",
        price: 90,
        category: "Signature",
        imageUrl: "/golden-peda.jpg", // Corrected image mapping
        quantity: 20,
        description: "Traditional saffron-infused delicacy."
      },
      {
        name: "Coconut Ladoo",
        price: 80,
        category: "Mithai",
        imageUrl: "/coconut-ladoo.jpg", // Corrected image mapping
        quantity: 20,
        description: "Sweet coconut spheres with a hint of cardamom."
      }
    ];

    for (const sweet of signatures) {
      const existing = await Sweet.findOne({ name: sweet.name });
      if (!existing) {
        await Sweet.create(sweet);
        console.log(`Added: ${sweet.name}`);
      } else {
        console.log(`Skipped (Already exists): ${sweet.name}`);
      }
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedSweets();

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }

  await mongoose.connect(process.env.MONGO_URI);
}

module.exports = connectDB;

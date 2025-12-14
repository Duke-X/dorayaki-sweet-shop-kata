require("dotenv").config();

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

// Setup DB
beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Admin Role Authorization", () => {
  it("should block non-admin users", async () => {
    const user = await User.create({
        name: "Regular User",
        email: `reg${Date.now()}@test.com`,
        password: "password123",
        role: "user"
    });
    const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    const res = await request(app)
      .get("/admin-only")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow admin users", async () => {
    const admin = await User.create({
        name: "Admin User",
        email: `adm${Date.now()}@test.com`,
        password: "password123",
        role: "admin"
    });
    const adminToken = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);

    const res = await request(app)
      .get("/admin-only")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});

require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");


const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

// Setup DB
beforeAll(async () => {
    await connectDB();
    // Clean up
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth Middleware", () => {
  it("should block access without token", async () => {
    const res = await request(app).get("/protected");
    expect(res.statusCode).toBe(401);
  });

  it("should block access with invalid token", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
  });

  it("should allow access with valid token", async () => {
    const user = await User.create({
        name: "Auth Test User",
        email: `auth${Date.now()}@test.com`,
        password: "password123",
        role: "user"
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Access granted");
  });
});

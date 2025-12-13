require("dotenv").config();

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const app = require("../app");

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Sweets API - View Sweets", () => {
  it("should return empty array when no sweets exist", async () => {
    const token = jwt.sign(
      { userId: "user123", role: "user" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

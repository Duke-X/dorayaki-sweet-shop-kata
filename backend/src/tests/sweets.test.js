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

  it("should allow admin to add a new sweet", async () => {
    const adminToken = jwt.sign(
      { userId: "admin123", role: "admin" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Kaju Katli",
        category: "barfi",
        price: 400,
        quantity: 20,
      });

    expect(res.statusCode).toBe(201);
  });

  it("should block non-admin users from adding a sweet", async () => {
    const userToken = jwt.sign(
      { userId: "user123", role: "user" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Motichoor Ladoo",
        category: "ladoo",
        price: 300,
        quantity: 50,
      });

    expect(res.statusCode).toBe(403);
  });

  it("should allow admin to update a sweet", async () => {
    const adminToken = jwt.sign(
      { userId: "admin123", role: "admin" },
      process.env.JWT_SECRET
    );

    const createRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Rasgulla",
        category: "sweet",
        price: 200,
        quantity: 30,
      });

    expect(createRes.statusCode).toBe(201);

    const getRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);

    const sweetId = getRes.body[0]._id;

    const updateRes = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: 250,
        quantity: 25,
      });

    expect(updateRes.statusCode).toBe(200);
  });

  it("should allow admin to update a sweet", async () => {
    const adminToken = jwt.sign(
      { userId: "admin123", role: "admin" },
      process.env.JWT_SECRET
    );
  
    const createRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Rasgulla",
        category: "sweet",
        price: 200,
        quantity: 30,
      });
  
    expect(createRes.statusCode).toBe(201);
  
    const getRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);
  
    const sweetId = getRes.body[0]._id;
  
    const updateRes = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: 250,
        quantity: 25,
      });
  
    expect(updateRes.statusCode).toBe(200);
  });
  
});

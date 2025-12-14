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

const User = require("../models/User");

// Helper to create token with real user
const createTestUser = async (role = "user") => {
    const user = await User.create({
        name: "Test User",
        email: `test${Date.now()}@test.com`,
        password: "password123",
        role: role
    });
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
};

describe("Sweets API - View Sweets", () => {
  it("should return empty array when no sweets exist", async () => {
    const token = await createTestUser("user");

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should allow admin to add a new sweet", async () => {
    const adminToken = await createTestUser("admin");

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Kaju Katli",
        category: "barfi",
        price: 400,
        quantity: 20,
        imageUrl: "http://example.com/img.jpg" // Image URL helps if multer is bypassed or we need mock
      });

    expect(res.statusCode).toBe(201);
  });

  it("should block non-admin users from adding a sweet", async () => {
    const userToken = await createTestUser("user");

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
    const adminToken = await createTestUser("admin");

    const createRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Rasgulla",
        category: "sweet",
        price: 200,
        quantity: 30,
        imageUrl: "http://example.com/img.jpg"
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

  // DUPLICATE TEST REMOVED (Previous file had two identical "update a sweet" tests)

  it("should allow admin to delete a sweet", async () => {
    const adminToken = await createTestUser("admin");

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Peda",
        category: "sweet",
        price: 180,
        quantity: 20,
        imageUrl: "http://example.com/img.jpg"
      });

    const sweetsRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);

    const sweetId = sweetsRes.body[0]._id;

    const deleteRes = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.statusCode).toBe(200);

    const verifyRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(verifyRes.body.length).toBe(0);
  });

  it("should block non-admin users from deleting a sweet", async () => {
    const adminToken = await createTestUser("admin");
    const userToken = await createTestUser("user");

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Soan Papdi",
        category: "sweet",
        price: 220,
        quantity: 30,
        imageUrl: "http://example.com/img.jpg"
      });

    const sweetsRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);

    const sweetId = sweetsRes.body[0]._id;

    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow user to purchase a sweet and reduce quantity", async () => {
    const adminToken = await createTestUser("admin");
    const userToken = await createTestUser("user");

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gulab Jamun",
        category: "sweet",
        price: 250,
        quantity: 10,
        imageUrl: "http://example.com/img.jpg"
      });

    const sweetsRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);

    const sweetId = sweetsRes.body[0]._id;

    const purchaseRes = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 3 });

    expect(purchaseRes.statusCode).toBe(200);

    const verifyRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);

    expect(verifyRes.body[0].quantity).toBe(7);
  });

  it("should not allow purchase if quantity is insufficient", async () => {
    const adminToken = await createTestUser("admin");
    const userToken = await createTestUser("user");

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Kalakand",
        category: "sweet",
        price: 300,
        quantity: 2,
        imageUrl: "http://example.com/img.jpg"
      });

    const sweetsRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);

    const sweetId = sweetsRes.body[0]._id;

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(400);
  });

  it("should allow admin to restock a sweet and increase quantity", async () => {
    const adminToken = await createTestUser("admin");
  
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Besan Ladoo",
        category: "ladoo",
        price: 220,
        quantity: 10,
        imageUrl: "http://example.com/img.jpg"
      });
  
    const sweetsRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);
  
    const sweetId = sweetsRes.body[0]._id;
  
    const restockRes = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 15 });
  
    expect(restockRes.statusCode).toBe(200);
  
    const verifyRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);
  
    expect(verifyRes.body[0].quantity).toBe(25);
  });

  it("should block non-admin users from restocking sweets", async () => {
    const adminToken = await createTestUser("admin");
    const userToken = await createTestUser("user");
  
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Milk Cake",
        category: "sweet",
        price: 260,
        quantity: 5,
        imageUrl: "http://example.com/img.jpg"
      });
  
    const sweetsRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);
  
    const sweetId = sweetsRes.body[0]._id;
  
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 10 });
  
    expect(res.statusCode).toBe(403);
  });
  
});

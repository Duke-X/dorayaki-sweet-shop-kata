const request = require("supertest");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const app = require("../app");
const User = require("../models/User");

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

describe("Auth: User Registration", () => {
  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "user@mail.com",
      password: "pass123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should not return password in response", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Another User",
      email: "another@mail.com",
      password: "secret123",
    });

    expect(res.body.password).toBeUndefined();
  });

  it("should not allow duplicate email registration", async () => {
    await request(app).post("/api/auth/register").send({
      name: "User One",
      email: "duplicate@mail.com",
      password: "passw123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "User Two",
      email: "duplicate@mail.com",
      password: "passw123",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should store hashed password instead of plain text", async () => {
    const plainPassword = "mypassword123";

    await request(app).post("/api/auth/register").send({
      name: "Secure User",
      email: "secure@mail.com",
      password: plainPassword,
    });

    const user = await User.findOne({ email: "secure@mail.com" });

    expect(user.password).not.toBe(plainPassword);
  });
});

describe("Auth: User Login", () => {
  it("should login user with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@mail.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@mail.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Wrong Pass",
      email: "wrong@mail.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@mail.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should reject login if user does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nouser@mail.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });
});

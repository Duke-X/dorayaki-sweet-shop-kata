const request = require("supertest");
const app = require("../app");

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
});

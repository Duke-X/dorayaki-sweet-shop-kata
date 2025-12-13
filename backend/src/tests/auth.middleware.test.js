require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");


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
    const token = jwt.sign({ userId: "test-user-id" }, process.env.JWT_SECRET);

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Access granted");
  });
});

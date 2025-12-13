require("dotenv").config();

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

describe("Admin Role Authorization", () => {
  it("should block non-admin users", async () => {
    const userToken = jwt.sign(
      { userId: "user123", role: "user" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .get("/admin-only")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow admin users", async () => {
    const adminToken = jwt.sign(
      { userId: "admin123", role: "admin" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .get("/admin-only")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});

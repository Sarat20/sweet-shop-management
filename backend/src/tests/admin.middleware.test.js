const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashed = await bcrypt.hash("123456", 10);
  const regularUser = await User.create({
    name: "regular user",
    email: "regular@test.com",
    password: hashed,
    role: "user",
  });

  const adminUser = await User.create({
    name: "admin user",
    email: "admin@test.com",
    password: hashed,
    role: "admin",
  });

  global.regularToken = jwt.sign(
    { userId: regularUser._id },
    process.env.JWT_SECRET
  );

  global.adminToken = jwt.sign(
    { userId: adminUser._id },
    process.env.JWT_SECRET
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("admin middleware", () => {
  it("should allow admin user to access protected route", async () => {
    const res = await request(app)
      .get("/api/protected-admin")
      .set("Authorization", `Bearer ${global.adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("should reject regular user from accessing admin route", async () => {
    const res = await request(app)
      .get("/api/protected-admin")
      .set("Authorization", `Bearer ${global.regularToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toContain("admin");
  });

  it("should reject request without token", async () => {
    const res = await request(app).get("/api/protected-admin");

    expect(res.statusCode).toBe(401);
  });
});


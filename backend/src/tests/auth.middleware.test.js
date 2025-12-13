const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashed = await bcrypt.hash("123456", 10);
  const user = await User.create({
    name: "sarat",
    email: "sarat@test.com",
    password: hashed,
  });

  global.token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("auth middleware", () => {
  it("should block request without token", async () => {
    const res = await request(app).get("/api/protected");

    expect(res.statusCode).toBe(401);
  });

  it("should allow request with valid token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
  });
});

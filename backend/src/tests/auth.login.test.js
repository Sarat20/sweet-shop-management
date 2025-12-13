const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("123456", 10);
  await User.create({
    name: "Sarat",
    email: "sarat@test.com",
    password: hashedPassword,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth Login API", () => {
  it("should login user with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "sarat@test.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "sarat@test.com",
        password: "wrongpass",
      });

    expect(res.statusCode).toBe(401);
  });
});

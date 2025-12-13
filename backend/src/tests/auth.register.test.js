const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth Register API", () => {
  it("should not allow duplicate email registration", async () => {
    const userData = {
      name: "Sarat",
      email: "sarat@test.com",
      password: "123456",
    };

    
    const firstRes = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(firstRes.statusCode).toBe(201);

    
    const secondRes = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(secondRes.statusCode).toBe(400);
  });
});

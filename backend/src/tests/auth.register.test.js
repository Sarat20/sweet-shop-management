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
  it("should hash password before saving user", async () => {
    const plainPassword = "123456";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sarat",
        email: "sarat@test.com",
        password: plainPassword,
      });

    const user = await User.findOne({ email: "sarat@test.com" });

    expect(user).toBeTruthy();
    expect(user.password).not.toBe(plainPassword);
  });
});

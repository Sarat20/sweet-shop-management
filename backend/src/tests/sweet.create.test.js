const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Sweet = require("../models/Sweet");
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

describe("add sweet api", () => {
  it("should add a sweet when token is valid", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        name: "jalebi",
        category: "indian",
        price: 40,
        quantity: 20,
      });

    expect(res.statusCode).toBe(201);

    const sweet = await Sweet.findOne({ name: "jalebi" });
    expect(sweet).toBeTruthy();
  });
});

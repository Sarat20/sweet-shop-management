const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Sweet = require("../models/Sweet");
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

  global.sweet = await Sweet.create({
    name: "rasgulla",
    category: "indian",
    price: 30,
    quantity: 2,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("purchase sweet api", () => {
  it("should reduce sweet quantity by one", async () => {
    const res = await request(app)
      .post(`/api/sweets/${global.sweet._id}/purchase`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);

    const sweet = await Sweet.findById(global.sweet._id);
    expect(sweet.quantity).toBe(1);
  });
});

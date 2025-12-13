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

  global.sweet = await Sweet.create({
    name: "mysore pak",
    category: "indian",
    price: 70,
    quantity: 5,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("restock sweet api", () => {
  it("should increase sweet quantity when admin token is provided", async () => {
    const res = await request(app)
      .post(`/api/sweets/${global.sweet._id}/restock`)
      .set("Authorization", `Bearer ${global.adminToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);

    const sweet = await Sweet.findById(global.sweet._id);
    expect(sweet.quantity).toBe(10);
  });

  it("should return 403 when regular user tries to restock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${global.sweet._id}/restock`)
      .set("Authorization", `Bearer ${global.regularToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(403);
  });
});

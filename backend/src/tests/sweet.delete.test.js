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

describe("delete sweet api", () => {
  it("should delete a sweet when admin token is provided", async () => {
    const sweet = await Sweet.create({
      name: "test sweet",
      category: "indian",
      price: 50,
      quantity: 10,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${global.adminToken}`);

    expect(res.statusCode).toBe(200);

    const deletedSweet = await Sweet.findById(sweet._id);
    expect(deletedSweet).toBeNull();
  });

  it("should return 403 when regular user tries to delete", async () => {
    const sweet = await Sweet.create({
      name: "test sweet 2",
      category: "indian",
      price: 50,
      quantity: 10,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${global.regularToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should return 404 when sweet not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/sweets/${fakeId}`)
      .set("Authorization", `Bearer ${global.adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});


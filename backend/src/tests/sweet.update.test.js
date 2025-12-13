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

describe("update sweet api", () => {
  it("should update a sweet when token is valid", async () => {
    const sweet = await Sweet.create({
      name: "gulab jamun",
      category: "indian",
      price: 50,
      quantity: 10,
    });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        name: "gulab jamun updated",
        category: "indian",
        price: 60,
        quantity: 15,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("gulab jamun updated");
    expect(res.body.price).toBe(60);
    expect(res.body.quantity).toBe(15);

    const updatedSweet = await Sweet.findById(sweet._id);
    expect(updatedSweet.name).toBe("gulab jamun updated");
  });

  it("should return 404 when sweet not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/sweets/${fakeId}`)
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        name: "test",
        category: "indian",
        price: 50,
        quantity: 10,
      });

    expect(res.statusCode).toBe(404);
  });
});


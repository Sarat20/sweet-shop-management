const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Sweet = require("../models/Sweet");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Sweet.create([
    {
      name: "laddu",
      category: "indian",
      price: 50,
      quantity: 10,
    },
    {
      name: "barfi",
      category: "indian",
      price: 60,
      quantity: 5,
    },
  ]);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("list sweets api", () => {
  it("should return all sweets", async () => {
    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });
});

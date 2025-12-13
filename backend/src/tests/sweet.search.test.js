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
      name: "donut",
      category: "bakery",
      price: 40,
      quantity: 5,
    },
    {
      name: "cake",
      category: "bakery",
      price: 200,
      quantity: 3,
    },
    {
      name: "barfi",
      category: "indian",
      price: 30,
      quantity: 8,
    },
  ]);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("search sweets api", () => {
  it("should search sweets by name", async () => {
    const res = await request(app).get(
      "/api/sweets/search?name=laddu"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("laddu");
  });

  it("should filter sweets by price range", async () => {
    const res = await request(app).get(
      "/api/sweets/search?minPrice=40&maxPrice=60"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.every(sweet => sweet.price >= 40 && sweet.price <= 60)).toBe(true);
  });

  it("should filter sweets by min price only", async () => {
    const res = await request(app).get(
      "/api/sweets/search?minPrice=50"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.every(sweet => sweet.price >= 50)).toBe(true);
  });

  it("should filter sweets by max price only", async () => {
    const res = await request(app).get(
      "/api/sweets/search?maxPrice=50"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.every(sweet => sweet.price <= 50)).toBe(true);
  });
});

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
});

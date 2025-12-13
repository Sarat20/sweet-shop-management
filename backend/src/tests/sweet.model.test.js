const mongoose = require("mongoose");
const Sweet = require("../models/Sweet");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("sweet model", () => {
  it("should save sweet with required fields", async () => {
    const sweet = new Sweet({
      name: "laddu",
      category: "indian",
      price: 50,
      quantity: 10,
    });

    const savedSweet = await sweet.save();

    expect(savedSweet._id).toBeDefined();
    expect(savedSweet.name).toBe("laddu");
    expect(savedSweet.price).toBe(50);
  });
});

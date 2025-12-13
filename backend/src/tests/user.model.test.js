const mongoose = require("mongoose");
const User = require("../models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("User model", () => {
  it("should have role field with default value 'user'", async () => {
    const user = await User.create({
      name: "test user",
      email: "test@test.com",
      password: "hashedpassword",
    });

    expect(user.role).toBe("user");
  });

  it("should allow setting role to 'admin'", async () => {
    const admin = await User.create({
      name: "admin user",
      email: "admin@test.com",
      password: "hashedpassword",
      role: "admin",
    });

    expect(admin.role).toBe("admin");
  });
});


const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Auth Register API", () => {
  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  it("should register a new user and save to database", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sarat",
        email: "sarat@test.com",
        password: "123456",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe("sarat@test.com");
  });
});

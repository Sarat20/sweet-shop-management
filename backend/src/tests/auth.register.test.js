const request = require("supertest");
const app = require("../app");

describe("auth register API", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sarat",
        email: "sarat@test.com",
        password: "123456",
      });

    expect(response.statusCode).toBe(201);
  });
});

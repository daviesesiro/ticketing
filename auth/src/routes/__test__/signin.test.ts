import { app } from "../../app";
import request from "supertest";

describe("Signin", () => {
  it("fails when a email that does not exist is supplied", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(400);
  });

  it("fails when a signing in with incorrect password", async () => {
    await global.signup();

    await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "wrong-password" })
      .expect(400);
  });

  it("Responds with a cookie with valid credentials", async () => {
    await global.signup();

    const res = await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(200);

    expect(res.get("Set-Cookie")).toBeDefined();
  });
});

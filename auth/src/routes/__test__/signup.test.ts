import request from "supertest";
import { app } from "../../app";

describe("Signup", () => {
  it("returns a 201 on a successful signup", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
  });

  it("returns a 400 with bad input", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "testtest.com",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 with invalid password", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "p",
      })
      .expect(400);
  });

  it("returns a 400 with missing email and password", () => {
    return request(app).post("/api/users/signup").send({}).expect(400);
  });

  it("disallows duplicate emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });

  it("sets a cookie after succesful sign up", async () => {
    const res = await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    expect(res.get("Set-Cookie")).toBeDefined();
  });
});

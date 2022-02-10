import request from "supertest";
import { app } from "../../app";

describe("Create new test", () => {
  it("Has a route handler to /api/tickets for post requests", () => {
    request(app)
      .post("/api/tickets")
      .send({})
      .then((res) => expect(res.status).not.toEqual(404));
  });

  it("Can only be access if user is signed in", () => {
    request(app)
      .post("/api/tickets")
      .send({})
      .then((res) => expect(res.status).toEqual(401));
  });

  it("Return a status other than 401 if user is signed in", () => {
    request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({})
      .then((res) => expect(res.status).not.toEqual(401));
  });

  it("returns an error if an invalid title is provided", () => {});
  it("returns an error if an invalid price is provided", () => {});
  it("creates a ticket with valid inputs", () => {});
});

import { Types } from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { createTicket } from "./index.test";

describe("Update a ticket", () => {
  it("returns a 404 if the provided ticket does not exist", async () => {
    await request(app)
      .put("/api/tickets/" + new Types.ObjectId().toHexString())
      .send({
        title: "adadsf",
        price: 12,
      })
      .set("Cookie", global.signup())
      .expect(404);
  });

  it("returns a 401 if the user is not authenticated", async () => {
    await request(app)
      .put("/api/tickets/" + new Types.ObjectId().toHexString())
      .send({
        title: "adadsf",
        price: 12,
      })
      .expect(401);
  });

  it("returns a 401 if the user is not the owner", async () => {
    const res = await createTicket();
    await request(app)
      .put("/api/tickets/" + res.body.id)
      .send({
        title: "adadsf",
        price: 12,
      })
      .set("Cookie", global.signup())
      .send({ title: "adfadfadsfasf", price: 1000 })
      .expect(401);
  });

  it("returns a 400 if the user provides an invalid input", async () => {
    const cookie = global.signup();

    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "adadfasdf", price: 400 })
      .expect(201);

    await request(app)
      .put("/api/tickets/" + res.body.id)
      .send({ price: 12 })
      .set("Cookie", cookie)
      .expect(400);

    await request(app)
      .put("/api/tickets/" + res.body.id)
      .send({ title: "asfasdf" })
      .set("Cookie", cookie)
      .expect(400);
  });

  it("Update ticket with valid input", async () => {
    const cookie = global.signup();

    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "adadfasdf", price: 400 })
      .expect(201);

    const title = "something cool";
    const price = 50;
    await request(app)
      .put("/api/tickets/" + res.body.id)
      .send({ price, title })
      .set("Cookie", cookie)
      .then((res) => {
        expect(res.body.title).toEqual(title);
        expect(res.body.price).toEqual(price);
      });
  });
});

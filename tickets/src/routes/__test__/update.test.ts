import { Types } from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";
import { createTicket } from "./index.test";
import mongoose from "mongoose";

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

  it("It publishes an event", async () => {
    const cookie = global.signup();

    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "adadfasdf", price: 400 });

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

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  it("rejects edits if ticket is reserved", async () => {
    const cookie = global.signup();

    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "adadfasdf", price: 400 });

    const title = "something cool";
    const price = 50;

    const ticket = await Ticket.findById(res.body.id);
    await ticket!
      .set({ orderId: new mongoose.Types.ObjectId().toHexString() })
      .save();

    await request(app)
      .put("/api/tickets/" + res.body.id)
      .send({ price, title })
      .set("Cookie", cookie)
      .expect(400);
  });
});

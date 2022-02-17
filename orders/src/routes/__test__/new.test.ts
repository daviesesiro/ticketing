import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@de-ticketing/common";

describe("Create new order", () => {
  it("it returns an error if ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
      .post("/api/orders")
      .send({
        ticketId,
      })
      .set("Cookie", global.signup())
      .expect(404);
  });

  it("it returns an error if ticket is already reserved", async () => {
    const ticket = await Ticket.create({ title: "Concert", price: 20 });

    await Order.create({
      ticket,
      expiresAt: new Date(),
      status: OrderStatus.Created,
      userId: "132342342342324",
    });

    await request(app)
      .post("/api/orders")
      .send({
        ticketId: ticket.id,
      })
      .set("Cookie", global.signup())
      .expect(400);
  });

  it("it reserves a ticket", async () => {
    const ticket = await Ticket.create({ title: "Concert", price: 20 });

    await request(app)
      .post("/api/orders")
      .send({
        ticketId: ticket.id,
      })
      .set("Cookie", global.signup())
      .expect(201);
  });

  it.todo("emits an order created event");
});

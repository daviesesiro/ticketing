import { OrderStatus } from "@de-ticketing/common";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

describe("Cancel an order", () => {
  it("marks an order as cancelled", async () => {
    const ticket = await Ticket.create({ title: "conert", price: 200 });

    const user = global.signup();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .delete("/api/orders/" + order.id)
      .set("Cookie", user)
      .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it("Emits an order cancelled event", async () => {
    const ticket = await Ticket.create({ title: "conert", price: 200 });

    const user = global.signup();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .delete("/api/orders/" + order.id)
      .set("Cookie", user)
      .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});

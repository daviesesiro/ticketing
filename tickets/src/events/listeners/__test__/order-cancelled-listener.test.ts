import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  TicketUpdatedEvent,
} from "@de-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = await Ticket.create({
    userId: "232323",
    price: 220,
    title: "concern",
  });

  await ticket.set({ orderId }).save();

  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, orderId, ticket };
};

describe("Order cancelled listener test", () => {
  it("updates the ticket, publishes an event and acks the message", async () => {
    const { ticket, msg, listener, orderId, data } = await setup();

    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toBeUndefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});

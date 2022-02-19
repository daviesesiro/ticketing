import {
  OrderCreatedEvent,
  OrderStatus,
  TicketUpdatedEvent,
} from "@de-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listner";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = await Ticket.create({
    userId: "232323",
    price: 220,
    title: "concern",
  });

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "asdfafasf",
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, ticket };
};

describe("Order created listener test", () => {
  it("sets userId of the ticket", async () => {
    const { ticket, msg, listener, data } = await setup();

    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
  });

  it("acks the messages", async () => {
    const { msg, listener, data } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it("it publishes a ticket updated event", async () => {
    const { msg, listener, data, ticket } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const publishedEvent = JSON.parse(
      (<jest.Mock>natsWrapper.client.publish).mock.calls[0][1]
    ) as TicketUpdatedEvent["data"];

    expect(publishedEvent.id).toEqual(ticket.id);
    expect(publishedEvent.orderId).toEqual(data.id);
  });
});

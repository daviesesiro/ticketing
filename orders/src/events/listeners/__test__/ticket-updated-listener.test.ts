import { TicketCreatedEvent, TicketUpdatedEvent } from "@de-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await Ticket.create({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 200,
  });

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "Concert update",
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 300,
    version: ticket.version + 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
    getSequence: jest.fn().mockReturnValue(1),
  };

  return { msg, data, ticket, listener };
};

describe("Ticket updated listener", () => {
  it("finds, updates, and saves a ticket", async () => {
    const { listener, msg, ticket, data } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
  });

  it("creates and saves ticket", async () => {
    const { listener, msg, data } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it("does not ack if the version number is out of order", async () => {
    const { msg, data, listener } = await setup();

    //setting future version
    data.version = 10;

    try {
      await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
  });
});

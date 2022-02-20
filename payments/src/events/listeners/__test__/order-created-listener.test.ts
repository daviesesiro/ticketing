import { OrderCreatedEvent, OrderStatus } from "@de-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "asdfadfaf",
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 200,
    },
    expiresAt: "asfasf",
    status: OrderStatus.Created,
    version: 0,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("order created listener test", () => {
  it("replicates order info", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order).toBeDefined();
    expect(order!.id).toEqual(data.id);
    expect(order!.price).toEqual(data.ticket.price);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});

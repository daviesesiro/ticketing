import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@de-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = await Order.create({
    status: OrderStatus.Created,
    price: 200,
    id: new mongoose.Types.ObjectId(),
    userId: "asdfasdf",
    version: 0,
  });

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
    version: 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

jest.setTimeout(100000);

describe("order cancelled listener test", () => {
  it("updates order status to cancelled", async () => {
    const { listener, data, order, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder).toBeDefined();
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});

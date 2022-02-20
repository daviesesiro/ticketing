import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { OrderStatus, PaymentCreatedEvent } from "@de-ticketing/common";
import { Message } from "node-nats-streaming";
import { PaymentCreatedListener } from "../payment-created-listener";
import { randomBytes } from "crypto";

const setup = async () => {
  const listener = new PaymentCreatedListener(natsWrapper.client);

  const order = await Order.create({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: new mongoose.Types.ObjectId(),
    userId: "asdfadsff",
  });

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  const data: PaymentCreatedEvent["data"] = {
    orderId: order.id,
    id: new mongoose.Types.ObjectId().toHexString(),
    reference: "tx_ref_" + randomBytes(10).toString("hex"),
  };

  return { order, listener, data, msg };
};

describe("Payment completed test", () => {
  it("updates order status to completed", async () => {
    const { data, listener, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
  });

  it("ack the message", async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});

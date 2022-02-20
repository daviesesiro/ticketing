import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { ExpirationCompleteEvent, OrderStatus } from "@de-ticketing/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = await Ticket.create({
    title: "conert",
    price: 200,
    id: new mongoose.Types.ObjectId(),
  });

  const order = await Order.create({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
    userId: "asdfadsff",
  });

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  return { order, listener, ticket, data, msg };
};

describe("Expiration complete test", () => {
  it("updates order status to cancelled", async () => {
    const { data, listener, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it("emit an order cancelled event", async () => {
    const { data, listener, msg, order } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(
      JSON.parse((<jest.Mock>natsWrapper.client.publish).mock.calls[0][1]).id
    ).toEqual(order.id);
  });

  it("ack the message", async () => {
    const { data, listener, msg, order } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});

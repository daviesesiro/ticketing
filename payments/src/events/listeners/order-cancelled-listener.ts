import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@de-ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    try {
      const order = await Order.findById(data.id);

      if (!order) throw new Error("Order not found");
      if (order.version !== data.version - 1)
        throw new Error("Order not found");

      await order
        .set({
          status: OrderStatus.Cancelled,
          version: data.version,
        })
        .save();

      msg.ack();
    } catch (err) {
      console.error(err);
    }
  }
}

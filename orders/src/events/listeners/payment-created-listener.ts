import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@de-ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    try {
      const order = await Order.findById(data.orderId);

      if (!order) throw Error("order not found");

      await order.set({ status: OrderStatus.Complete }).save();

      msg.ack();
    } catch (err) {
      console.error();
    }
  }
}

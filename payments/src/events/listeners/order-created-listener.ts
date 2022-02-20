import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@de-ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = await Order.create({
      _id: data.id,
      price: data.ticket.price,
      version: data.version,
      userId: data.userId,
      status: OrderStatus.Created,
    });

    msg.ack();
  }
}

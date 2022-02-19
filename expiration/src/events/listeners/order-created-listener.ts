import { Listener, OrderCreatedEvent, Subjects } from "@de-ticketing/common";
import { Message } from "node-nats-streaming";
import { expQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "../queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage(data: OrderCreatedEvent["data"], msg: Message): void {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log("waiting this mils to process job: ", delay);
    expQueue.add({ orderId: data.id }, { delay: 10 * 1000 });

    msg.ack();
  }
}

import { Listener, Subjects, TicketCreatedEvent } from "@de-ticketing/common";
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data: ", data, "\n");
    msg.ack();
  }
}

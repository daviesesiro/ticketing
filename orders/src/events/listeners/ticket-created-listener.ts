import { Listener, Subjects, TicketCreatedEvent } from "@de-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: TicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { title, price, id } = data;
    const ticket = await Ticket.create({ title, price, _id: id });

    msg.ack();
  }
}

import { Listener, Subjects, TicketUpdatedEvent } from "@de-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ title: data.title, price: data.price });
    await ticket.save();

    msg.ack();
  }
}

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

    if (ticket.version === data.version) {
      console.log("acknowleding updates with no changes");
      return msg.ack(); // update was made but nothing was changed
    }

    // ticket came out of order, so we don't acknowledge it
    if (ticket.version !== data.version - 1) {
      console.log(`[${msg.getSequence()}] came out of order`);
      throw new Error("Ticket not found");
    }

    ticket.set({ title: data.title, price: data.price });
    await ticket.save();

    msg.ack();
  }
}

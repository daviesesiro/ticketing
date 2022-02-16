import { Publisher } from "./base-publisher";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedPublish extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

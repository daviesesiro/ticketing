import { Publisher, Subjects, TicketCreatedEvent } from "@de-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject = Subjects.TicketCreated;
}

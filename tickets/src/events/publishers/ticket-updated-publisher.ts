import { Publisher, Subjects, TicketUpdatedEvent } from "@de-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject = Subjects.TicketUpdated;
}

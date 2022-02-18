import { Publisher, OrderCreatedEvent, Subjects } from "@de-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject = Subjects.OrderCreated;
}

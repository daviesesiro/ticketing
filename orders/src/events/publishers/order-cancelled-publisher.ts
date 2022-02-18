import { Publisher, Subjects, OrderCancelledEvent } from "@de-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject = Subjects.OrderCancelled;
}

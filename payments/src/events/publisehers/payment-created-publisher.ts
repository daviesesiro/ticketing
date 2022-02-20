import { PaymentCreatedEvent, Publisher, Subjects } from "@de-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject = Subjects.PaymentCreated;
}

import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@de-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject = Subjects.ExpirationComplete;
}

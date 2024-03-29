import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@attickets02/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

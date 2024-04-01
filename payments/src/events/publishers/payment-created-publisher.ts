import { PaymentCreatedEvent, Publisher, Subjects } from "@attickets02/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

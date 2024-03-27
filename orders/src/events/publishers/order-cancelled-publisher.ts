import { OrderCancelledEvent, Publisher, Subjects } from "@attickets02/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

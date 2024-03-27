import { Publisher, OrderCreatedEvent, Subjects } from "@attickets02/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

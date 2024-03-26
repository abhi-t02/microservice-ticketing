import { Publisher, Subjects, TicketUpdatedEvent } from "@attickets02/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

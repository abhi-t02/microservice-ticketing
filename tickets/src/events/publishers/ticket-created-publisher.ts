import { Publisher, Subjects, TicketCreatedEvent } from "@attickets02/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

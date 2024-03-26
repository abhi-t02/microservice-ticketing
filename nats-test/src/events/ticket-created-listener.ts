import { Message, Stan } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-events";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  constructor(client: Stan) {
    super(client);
  }

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data", data);

    msg.ack();
  }
}

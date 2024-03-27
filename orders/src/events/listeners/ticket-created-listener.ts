import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@attickets02/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket.model";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    console.log("ticket created");
    const ticket = new Ticket({
      _id: id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}

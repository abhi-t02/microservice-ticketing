import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketUpdatedEvent } from "@attickets02/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket.model";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price } = data;
    console.log("update event");
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}

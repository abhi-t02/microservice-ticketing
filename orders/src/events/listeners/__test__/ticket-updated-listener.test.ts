import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@attickets02/common";

import { Ticket } from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = new Ticket({
    id: new Types.ObjectId().toHexString(),
    title: "new one",
    price: 300,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: ticket.price,
    title: ticket.title,
    version: ticket.version + 1,
    userId: "acsdc",
  };

  // Create fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
  const { msg, listener, data, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(ticket.title);
});

it("acks the message", async () => {
  const { msg, data, listener, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

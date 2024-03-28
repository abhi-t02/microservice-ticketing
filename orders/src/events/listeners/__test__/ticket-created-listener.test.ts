import { TicketCreatedEvent } from "@attickets02/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket.model";

const setup = () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Crete fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    price: 200,
    title: "new one",
    version: 0,
    userId: new Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = setup();

  // Call the onMessage function
  await listener.onMessage(data, msg);

  // Write assertions make sure ticket is created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
});

it("acks the messages", async () => {
  const { listener, data, msg } = setup();

  // Call the onMessage method
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

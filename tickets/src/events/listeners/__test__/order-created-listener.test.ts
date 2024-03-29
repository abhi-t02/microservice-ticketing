import { OrderCreatedEvent, OrderStatus } from "@attickets02/common";
import Ticket from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedlistener } from "../order-created-listener";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

const id = new Types.ObjectId().toHexString();

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedlistener(natsWrapper.client);

  // Create and save a ticket
  const ticket = new Ticket({
    title: "new one",
    price: 300,
    version: 0,
    userId: "akdbcka",
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: id,
    version: 0,
    status: OrderStatus.Created,
    userId: ticket.userId,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    expiresAt: Date.now().toString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("sets the userId of the ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.ticket.id);

  expect(updatedTicket?.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event.", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});

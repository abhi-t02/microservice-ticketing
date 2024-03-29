import { Types } from "mongoose";
import Ticket from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent } from "@attickets02/common";
import { Message } from "node-nats-streaming";

const orderId = new Types.ObjectId().toHexString();

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = new Ticket({
    price: 300,
    title: "new one",
    userId: "acdjk",
    version: 0,
    orderId,
  });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    ticket: {
      id: ticket.id,
    },
    version: ticket.version,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data, ticket };
};

it("updates the ticket, acks the ticket and publishes an event", async () => {
  const { msg, listener, data, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

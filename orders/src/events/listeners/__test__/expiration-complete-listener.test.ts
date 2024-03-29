import { ExpirationCompleteEvent, OrderStatus } from "@attickets02/common";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket.model";
import { Order } from "../../../models/order.model";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = new Ticket({
    title: "new One",
    price: 300,
  });

  const order = new Order({
    ticket,
    userId: "clkacnl",
    status: OrderStatus.Created,
    expiresAt: Date.now(),
  });
  await ticket.save();

  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data, order, ticket };
};

// it("updates the order status to cancelled.", async () => {
//   const { listener, msg, data, order, ticket } = await setup();

//   await listener.onMessage(data, msg);

//   const updateOrder = await Order.findById(data.orderId);
//   expect(updateOrder?.status).toEqual(OrderStatus.Cancelled);
// });

it("emits an OrderCancelled event", async () => {
  const { listener, msg, data, order, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, msg, data, order, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

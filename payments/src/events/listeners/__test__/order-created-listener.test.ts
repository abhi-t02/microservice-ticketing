import { OrderCreatedEvent, OrderStatus } from "@attickets02/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Types } from "mongoose";
import { Order } from "../../../models/order.model";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: "jkabncjksd",
      price: 300,
    },
    userId: "dihdk",
    version: 0,
    expiresAt: Date.now().toString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();
  listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order?.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  listener.onMessage(data, msg);
});

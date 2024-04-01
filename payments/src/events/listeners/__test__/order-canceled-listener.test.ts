import { OrderCancelledEvent, OrderStatus } from "@attickets02/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { natsWrapper } from "../../../nats-wrapper";
import { OrderCanceledListener } from "../order-canceled-listener";
import { Order } from "../../../models/order.model";

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  const order = new Order({
    _id: new Types.ObjectId().toHexString(),
    price: 300,
    status: OrderStatus.Created,
    userId: "dcjkadbck",
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: "sjkdhvjlksd",
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, msg, listener, order };
};

it("updates the status of the order.", async () => {
  const { data, msg, listener, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { data, msg, listener, order } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

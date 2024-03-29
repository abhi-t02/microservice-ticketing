import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@attickets02/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = new Order({
      userId: data.userId,
      price: data.ticket.price,
      status: data.status,
      version: data.version,
      _id: data.id,
    });
    await order.save();

    msg.ack();
  }
}

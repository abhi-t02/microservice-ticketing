import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@attickets02/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";

/**
 * TODO
 */

export class OrderCanceledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findById(data.id);

    order?.set({ status: OrderStatus.Cancelled });
    await order?.save();

    msg.ack();
  }
}

import { NextFunction, Request, Response } from "express";
import { Order } from "../models/order.model";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@attickets02/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

interface AuthRequest extends Request {
  currentUser: {
    id: string;
    email: string;
  };
}

export async function cancelOrderHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser.id) {
      throw new NotAuthorizedError("User id not valid");
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    /**
     * TODO Publishing an event for cancelled order
     */
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

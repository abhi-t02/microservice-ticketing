import { NextFunction, Request, Response } from "express";
import { Order } from "../models/order.model";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@attickets02/common";

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
    const order = await Order.findById(req.params.id);

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

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

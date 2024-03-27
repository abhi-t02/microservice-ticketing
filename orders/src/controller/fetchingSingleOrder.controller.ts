import { Request, Response, NextFunction } from "express";
import { Order } from "../models/order.model";
import { NotAuthorizedError, NotFoundError } from "@attickets02/common";

interface AuthRequest extends Request {
  currentUser: {
    id: string;
    email: string;
  };
}

export async function fetchSingleOrderHandler(
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
      throw new NotAuthorizedError("User id not valid.");
    }

    res.send(order);
  } catch (err) {
    next(err);
  }
}

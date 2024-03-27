import { Request, Response, NextFunction } from "express";
import { Order } from "../models/order.model";

interface AuthRequest extends Request {
  currentUser: {
    id: string;
    email: string;
  };
}

export async function getOrdersHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await Order.find({
      userId: req.currentUser.id,
    }).populate("ticket");

    res.send(orders);
  } catch (err) {
    next(err);
  }
}

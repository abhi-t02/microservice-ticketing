import { Request, Response, NextFunction } from "express";
import { OrderInput } from "../schema/orders.schema";

export async function createOrderHandler(
  req: Request<{}, {}, OrderInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
  } catch (err) {
    next(err);
  }
}

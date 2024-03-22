import { NextFunction, Request, Response } from "express";

import Ticket from "../models/ticket.model";

export async function getTicketsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tickets = await Ticket.find({});
    res.send(tickets);
  } catch (err) {
    next(err);
  }
}

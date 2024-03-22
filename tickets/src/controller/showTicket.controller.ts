import { NextFunction, Request, Response } from "express";
import { ShowTicketInput } from "../schema/ticket.schema";
import Ticket from "../models/ticket.model";
import { NotFoundError } from "@attickets02/common";

// Request <query, params, body>
export async function showTicketHandler(
  req: Request<ShowTicketInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  } catch (err) {
    next(err);
  }
}

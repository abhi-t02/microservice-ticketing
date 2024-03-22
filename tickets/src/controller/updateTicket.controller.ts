import { NextFunction, Request, Response } from "express";

import { UpdateTicketInput } from "../schema/ticket.schema";
import Ticket from "../models/ticket.model";
import { NotAuthorizedError, NotFoundError } from "@attickets02/common";

interface AuthRequest
  extends Request<UpdateTicketInput["params"], {}, UpdateTicketInput["body"]> {
  currentUser: {
    id: string;
    email: string;
  };
}

export async function updateHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    const { title, price } = req.body;

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser.id) {
      throw new NotAuthorizedError("No Update permission.");
    }

    const updatedTicket = await ticket.updateOne({
      title,
      price,
    });
    console.log(updatedTicket);
    res.send(updatedTicket);
  } catch (err) {
    next(err);
  }
}

import { NextFunction, Request, Response } from "express";
import { ticketInput } from "../schema/ticket.schema";
import Ticket from "../models/ticket.model";

interface TicketRequest extends Request<{}, {}, ticketInput["body"]> {
  currentUser: {
    id: string;
    email: string;
  };
}

export async function createTicketHandler(
  req: TicketRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, price } = req.body;
    const { id } = req.currentUser;

    const ticket = new Ticket({
      title,
      price,
      userId: id,
    });

    await ticket.save();

    res.status(201).send(ticket);
  } catch (err) {
    next(err);
  }
}

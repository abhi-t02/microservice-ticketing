import { NextFunction, Request, Response } from "express";

import { ticketInput } from "../schema/ticket.schema";
import Ticket from "../models/ticket.model";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    // Publishing event on NATS
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  } catch (err) {
    next(err);
  }
}

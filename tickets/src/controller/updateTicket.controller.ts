import { NextFunction, Request, Response } from "express";

import { UpdateTicketInput } from "../schema/ticket.schema";
import Ticket from "../models/ticket.model";
import { NotAuthorizedError, NotFoundError } from "@attickets02/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

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
    const updateData = req.body;

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser.id) {
      throw new NotAuthorizedError("No Update permission.");
    }

    ticket.set(updateData);
    await ticket.save();

    // Ticket update NATS
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  } catch (err) {
    next(err);
  }
}

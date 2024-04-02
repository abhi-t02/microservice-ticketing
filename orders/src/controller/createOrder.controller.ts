import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from "@attickets02/common";

import { OrderInput } from "../schema/orders.schema";
import { Ticket } from "../models/ticket.model";
import { Order } from "../models/order.model";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

// variables
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

// Auth request type
interface AuthRequest extends Request<{}, {}, OrderInput["body"]> {
  currentUser: {
    id: string;
    email: string;
  };
}

export async function createOrderHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in db
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure that this ticket is not reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is reserved.");
    }

    // Calculate expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Creating new order
    const order = new Order({
      userId: req.currentUser.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  } catch (err) {
    next(err);
  }
}

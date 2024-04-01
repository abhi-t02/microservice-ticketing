import { NextFunction, Request, Response } from "express";
import { PaymentInputSchema } from "../schema/payment.schema";
import { Order } from "../models/order.model";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  Publisher,
} from "@attickets02/common";
import { stripe } from "../stripe";
import { Payment } from "../models/payment.model";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

interface AuthRequest extends Request<{}, {}, PaymentInputSchema["body"]> {
  currentUser: {
    id: string;
    email: string;
  };
}

export async function createChargeHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser.id) {
      throw new NotAuthorizedError("User is not authorized.");
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Can not pay for an canceled order.");
    }

    // stripe payment integration
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "inr",
      amount: order.price * 100,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const payment = new Payment({
      orderId,
      stripeId: paymentIntent.id,
    });
    await payment.save();

    // publish an event
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.json({ client_secret: paymentIntent.client_secret, id: payment.id });
  } catch (err) {
    next(err);
  }
}

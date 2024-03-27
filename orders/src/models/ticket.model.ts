import { Model, model, Schema } from "mongoose";
import { Order } from "./order.model";
import { OrderStatus } from "@attickets02/common";

export interface TicketDoc extends Document {
  title: string;
  price: number;
}

interface TicketMethodDoc {
  isReserved: () => Promise<boolean>;
}

type TicketModel = Model<TicketDoc, {}, TicketMethodDoc>;

const TicketSchema = new Schema<TicketDoc, TicketModel, TicketMethodDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Checking is ticket is reserved or not
TicketSchema.methods.isReserved = async function () {
  const ticket = this as TicketDoc;

  const existingOrder = await Order.findOne({
    ticket,
    status: {
      $nin: [OrderStatus.Cancelled],
    },
  });

  return Boolean(existingOrder);
};

const Ticket = model<TicketDoc, TicketModel>("Ticket", TicketSchema);

export { Ticket };

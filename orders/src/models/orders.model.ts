import { Model, model, Schema } from "mongoose";

interface OrderDoc {
  ticketId: string;
  status: string;
  expiresAt: Date;

  /**
   * TODO TicketDoc implementation
   */
  ticket: any;
}

interface OrderMethodDoc {}

type OrderDocModel = Model<OrderDoc, {}, OrderMethodDoc>;

const OrderSchema = new Schema<OrderDoc, OrderDocModel, OrderMethodDoc>(
  {
    ticketId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
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

const Order = model<OrderDoc, OrderDocModel>("Order", OrderSchema);

export { Order };

import { Model, model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@attickets02/common";

import { TicketDoc } from "./ticket.model";

interface OrderDoc {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderMethodDoc {}

type OrderDocModel = Model<OrderDoc, {}, OrderMethodDoc>;

const OrderSchema = new Schema<OrderDoc, OrderDocModel, OrderMethodDoc>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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

OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin);

const Order = model<OrderDoc, OrderDocModel>("Order", OrderSchema);

export { Order };

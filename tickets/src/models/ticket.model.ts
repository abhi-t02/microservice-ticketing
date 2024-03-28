import { Model, model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketDoc {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  version: number;
}

interface TicketDocMethods {}

type TicketDocModel = Model<TicketDoc, {}, TicketDocMethods>;

const TicketSchema = new Schema<TicketDoc, TicketDocModel, TicketDocMethods>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
    },
    orderId: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

TicketSchema.set("versionKey", "version");
TicketSchema.plugin(updateIfCurrentPlugin);

const Ticket = model<TicketDoc, TicketDocModel>("Ticket", TicketSchema);

export default Ticket;

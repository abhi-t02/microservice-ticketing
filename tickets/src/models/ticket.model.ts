import { Model, model, Schema } from "mongoose";

interface TicketDoc {
  title: string;
  price: number;
  userId: string;
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

const Ticket = model<TicketDoc, TicketDocModel>("Ticket", TicketSchema);

export default Ticket;

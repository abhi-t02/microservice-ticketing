import { HydratedDocument, Model, model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@attickets02/common";

import { Order } from "./order.model";

export interface TicketDoc {
  id: string;
  title: string;
  price: number;
  version: number;
}

interface TicketMethodDoc {
  isReserved: () => Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc, {}, TicketMethodDoc> {
  findByEvent: (event: {
    id: string;
    version: number;
  }) => Promise<HydratedDocument<TicketDoc | null, TicketMethodDoc>>;
}

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

TicketSchema.set("versionKey", "version");
TicketSchema.plugin(<any>updateIfCurrentPlugin);

// pre saving versioning alternative for updateIfCurrentPlugin package
// TicketSchema.pre("save", function (done) {
//   this.$where = {
//     version: this.get("version") - 1,
//   };
//   done();
// });

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

// Listening event
TicketSchema.statics.findByEvent = async function (event: {
  id: string;
  version: number;
}) {
  const ticket = await Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });

  return ticket;
};

const Ticket = model<TicketDoc, TicketModel>("Ticket", TicketSchema);

export { Ticket };

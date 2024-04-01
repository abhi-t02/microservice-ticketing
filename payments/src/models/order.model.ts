import { OrderStatus } from "@attickets02/common";
import { HydratedDocument, Model, model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderDoc {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderMethodsDoc {}

interface OrderModel extends Model<OrderDoc, {}, OrderMethodsDoc> {
  findOrder: (event: {
    id: string;
    version: number;
  }) => Promise<HydratedDocument<OrderDoc | null>>;
}

const OrderSchema = new Schema<OrderDoc, OrderModel, OrderMethodsDoc>(
  {
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    userId: {
      type: String,
      required: true,
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
OrderSchema.plugin(<any>updateIfCurrentPlugin);

// statics method
OrderSchema.statics.findOrder = async function (event: {
  id: string;
  version: number;
}) {
  return await Order.findOne({ _id: event.id, version: event.version - 1 });
};

const Order = model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order };

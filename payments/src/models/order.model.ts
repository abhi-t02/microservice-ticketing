import { OrderStatus } from "@attickets02/common";
import { Model, model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderDoc {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderMethodsDoc {}

interface OrderModel extends Model<OrderDoc, {}, OrderMethodsDoc> {}

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
OrderSchema.plugin(updateIfCurrentPlugin);

const Order = model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order };

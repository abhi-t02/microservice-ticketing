import { model, Model, Schema } from "mongoose";

interface PaymentDoc {
  orderId: string;
  stripeId: string;
}

interface PaymentMethodsDoc {}

interface PaymentModel extends Model<PaymentDoc, {}, PaymentMethodsDoc> {}

const PaymentSchema = new Schema<PaymentDoc, PaymentModel, PaymentMethodsDoc>(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

const Payment = model<PaymentDoc, PaymentModel>("Payment", PaymentSchema);

export { Payment };

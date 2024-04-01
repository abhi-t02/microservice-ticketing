import { Types } from "mongoose";
import { object, string, TypeOf } from "zod";

export const PaymentSchema = object({
  body: object({
    token: string({
      required_error: "token is required.",
    }).trim(),
    orderId: string({
      required_error: "OrderId is required.",
    })
      .trim()
      .refine(
        (value) => Types.ObjectId.isValid(value),
        "Has to be valid OrderId"
      ),
  }),
});

export type PaymentInputSchema = TypeOf<typeof PaymentSchema>;

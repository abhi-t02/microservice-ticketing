import { Types } from "mongoose";
import { object, string, TypeOf } from "zod";

export const OrderSchema = object({
  body: object({
    ticketId: string({
      required_error: "Ticket id is required",
    })
      .trim()
      .refine(
        (value) => Types.ObjectId.isValid(value),
        "Has to be valid ticket id."
      ),
  }),
});

export type OrderInput = TypeOf<typeof OrderSchema>;

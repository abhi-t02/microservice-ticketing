import { number, object, string, TypeOf } from "zod";

export const TicketSchema = object({
  body: object({
    title: string({
      required_error: "title is required.",
    })
      .trim()
      .min(3, "Should be more than 3 character long"),
    price: number({ required_error: "Price is required." }).min(
      0,
      "Should be positive"
    ),
  }),
});

export type ticketInput = TypeOf<typeof TicketSchema>;

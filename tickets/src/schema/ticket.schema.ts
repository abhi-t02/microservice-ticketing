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

export const ShowTicketSchema = object({
  params: object({
    id: string({
      required_error: "id is required.",
    }).trim(),
  }),
});

export type ShowTicketInput = TypeOf<typeof ShowTicketSchema>;

export const UpdateTicketSchema = object({
  body: object({
    title: string({
      required_error: "title is required.",
    })
      .trim()
      .min(3, "Should be more than 3 character long")
      .optional(),
    price: number({ required_error: "Price is required." })
      .min(0, "Should be positive")
      .optional(),
  }),
  params: object({
    id: string({
      required_error: "id is required.",
    }).trim(),
  }).strict("id param required"),
});

export type UpdateTicketInput = TypeOf<typeof UpdateTicketSchema>;

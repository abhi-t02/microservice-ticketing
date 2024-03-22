import { Router } from "express";
import { requireAuth, validate } from "@attickets02/common";

import { createTicketHandler } from "../controller/createTicket.controller";
import {
  ShowTicketSchema,
  TicketSchema,
  UpdateTicketSchema,
} from "../schema/ticket.schema";
import { showTicketHandler } from "../controller/showTicket.controller";
import { getTicketsHandler } from "../controller/getAllTickets.controller";
import { updateHandler } from "../controller/updateTicket.controller";

const router = Router();

router.post("/", requireAuth, validate(TicketSchema), <any>createTicketHandler);

router.get("/", requireAuth, getTicketsHandler);
router.get("/:id", requireAuth, validate(ShowTicketSchema), showTicketHandler);

router.put(
  "/:id",
  requireAuth,
  validate(UpdateTicketSchema),
  <any>updateHandler
);

export { router as ticketsRouter };

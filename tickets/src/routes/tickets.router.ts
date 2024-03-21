import { Router } from "express";
import { requireAuth, validate } from "@attickets02/common";

import { createTicketHandler } from "../controller/createTicket.controller";
import { TicketSchema } from "../schema/ticket.schema";

const router = Router();

router.post("/", requireAuth, validate(TicketSchema), <any>createTicketHandler);

export { router as ticketsRouter };

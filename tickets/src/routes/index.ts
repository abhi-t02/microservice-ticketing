import { Router } from "express";

import { ticketsRouter } from "./tickets.router";

const router = Router();

const baseURL = `/api/v1`;

router.use(`${baseURL}/tickets`, ticketsRouter);

export default router;

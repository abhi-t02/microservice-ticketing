import { Router } from "express";
import { paymentsRouter } from "./payments.route";

const router = Router();

const baseURL = `/api/v1`;

router.use(`${baseURL}/payments`, paymentsRouter);

export default router;

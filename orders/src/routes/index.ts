import { Router } from "express";
import { ordersRouter } from "./orders.route";

const router = Router();

const baseURL = `/api/v1`;

router.use(`${baseURL}/orders`, ordersRouter);

export default router;

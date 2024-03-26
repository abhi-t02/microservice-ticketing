import { Router } from "express";
import { requireAuth, validate } from "@attickets02/common";
import { createOrderHandler } from "../controller/createOrder.controller";
import { OrderSchema } from "../schema/orders.schema";

const router = Router();

router.post("/", requireAuth, validate(OrderSchema), createOrderHandler);

export { router as ordersRouter };

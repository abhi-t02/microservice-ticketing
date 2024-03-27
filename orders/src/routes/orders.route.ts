import { Router } from "express";
import { requireAuth, validate } from "@attickets02/common";
import { createOrderHandler } from "../controller/createOrder.controller";
import { OrderSchema } from "../schema/orders.schema";
import { getOrdersHandler } from "../controller/getOrders.controller";
import { fetchSingleOrderHandler } from "../controller/fetchingSingleOrder.controller";
import { cancelOrderHandler } from "../controller/cancelOrder.controller";

const router = Router();

router.post("/", requireAuth, validate(OrderSchema), <any>createOrderHandler);

router.get("/", requireAuth, <any>getOrdersHandler);
router.get("/:id", requireAuth, <any>fetchSingleOrderHandler);

router.delete("/:id", requireAuth, <any>cancelOrderHandler);

export { router as ordersRouter };

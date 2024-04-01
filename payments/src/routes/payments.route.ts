import { requireAuth, validate } from "@attickets02/common";
import { Router } from "express";

import { PaymentSchema } from "../schema/payment.schema";
import { createChargeHandler } from "../controller/createCharge.controller";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate(PaymentSchema),
  <any>createChargeHandler
);

export { router as paymentsRouter };

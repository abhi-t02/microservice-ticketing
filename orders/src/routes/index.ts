import { Router } from "express";

const router = Router();

const baseURL = `/api/v1`;

router.use(`${baseURL}/orders`);

export default router;

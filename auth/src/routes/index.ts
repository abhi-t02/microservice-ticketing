import { Router } from "express";

import { userRouter } from "./users.route";

const router = Router();

const baseURL = `/api/v1`;

router.use(`${baseURL}/users`, userRouter);

export default router;

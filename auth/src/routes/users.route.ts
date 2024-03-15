import { Router } from "express";
import validate from "../middleware/validateResources.middleware";
import { signupUserSchema } from "../schema/users.schema";
import { signupUserHandler } from "../controller/users.controller";

const router = Router();

router.post("/signup", validate(signupUserSchema), signupUserHandler);

export { router as userRouter };

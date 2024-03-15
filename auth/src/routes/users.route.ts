import { Router } from "express";

import validate from "../middleware/validateResources.middleware";
import { signinUserSchema, signupUserSchema } from "../schema/users.schema";
import {
  signinUserHandler,
  signoutUserHandler,
  signupUserHandler,
} from "../controller/users.controller";
import { currentUserHandler } from "../controller/current-user.controller";

const router = Router();

router.post("/signup", validate(signupUserSchema), signupUserHandler);
router.post("/signin", validate(signinUserSchema), signinUserHandler);
router.post("/signout", signoutUserHandler);
router.get("/currentUser", currentUserHandler);

export { router as userRouter };

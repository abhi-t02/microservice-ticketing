import { Router } from "express";

import { validate } from "@attickets02/common";
import { signinUserSchema, signupUserSchema } from "../schema/users.schema";
import {
  signinUserHandler,
  signoutUserHandler,
  signupUserHandler,
} from "../controller/users.controller";
import { currentUserHandler } from "../controller/current-user.controller";
import { currentUser } from "@attickets02/common";
import { requireAuth } from "@attickets02/common";

const router = Router();

router.post("/signup", validate(signupUserSchema), signupUserHandler);
router.post("/signin", validate(signinUserSchema), signinUserHandler);
router.post("/signout", signoutUserHandler);
router.get("/currentuser", currentUser, requireAuth, currentUserHandler);

export { router as userRouter };

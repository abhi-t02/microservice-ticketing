import { NextFunction, Request, Response } from "express";

import { signinUserInput, signupUserInput } from "../schema/users.schema";
import User from "../models/user.model";
import { BadRequestError } from "@attickets02/common";
import { signJWT } from "../services/jwt.service";

/**
 *
 * @param req
 * @param res
 * @param next
 * @description Handling sign up user requests
 */
export async function signupUserHandler(
  req: Request<{}, {}, signupUserInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("User already exists.");
    }

    // Creating new user
    const user = new User({ email, password });
    await user.save();

    // Generate jwt
    const userJwt = signJWT({ id: user.id, email: user.email });
    req.session!.jwt = userJwt;

    res.status(201).json(user);
  } catch (err: any) {
    next(err);
  }
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @description Handling user sign in requests
 */
export async function signinUserHandler(
  req: Request<{}, {}, signinUserInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    // Find if user exists
    const loginUser = await User.findOne({ email });

    if (!loginUser) {
      throw new BadRequestError("Invalid credentials.");
    }

    // Checking for right password
    const isPasswordMatch = await loginUser.comparePassword(password);

    if (!isPasswordMatch) {
      throw new BadRequestError("Invalid credentials.");
    }

    // Generate token
    const userJwt = signJWT({ id: loginUser.id, email: loginUser.email });

    // JWT session cookie
    req.session!.jwt = userJwt;

    res.json(loginUser);
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @description user sign out
 */
export async function signoutUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.session = null;
    res.send({});
  } catch (err) {
    next(err);
  }
}

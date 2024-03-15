import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";

import { signupUserInput } from "../schema/users.schema";
import User from "../models/user.model";
import { BadRequestError } from "../errors/bad-request.errors";

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
    const userJwt = sign(
      {
        id: user._id,
        email: user.email,
      },
      <string>process.env.JWT_SECRET
    );
    req.session!.jwt = userJwt;
    res.status(201).json(user);
  } catch (err: any) {
    next(err);
  }
}

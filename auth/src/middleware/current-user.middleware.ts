import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/jwt.service";
import { JwtPayload } from "jsonwebtoken";

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = verifyToken(req.session.jwt);
    req.currentUser = payload;
  } catch (err) {}
  next();
};

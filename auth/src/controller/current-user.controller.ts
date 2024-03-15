import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../services/jwt.service";

export async function currentUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // !req.session || !req.session.jwt === !req.session?.jwt
    if (!req.session?.jwt) {
      return res.send({ currentUser: null });
    }

    const payload = verifyToken(req.session.jwt);
    res.send(payload);
  } catch (err) {
    next(err);
  }
}

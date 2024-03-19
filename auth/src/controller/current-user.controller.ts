import { NextFunction, Request, Response } from "express";

export async function currentUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.send({ currentUser: req.currentUser || null });
  } catch (err) {
    next(err);
  }
}

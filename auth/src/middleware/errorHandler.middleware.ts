import { NextFunction, Request, Response } from "express";

import { CustomError } from "../errors/customError.errors";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }
  next();
};

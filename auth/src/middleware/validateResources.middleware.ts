import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { RequestValidationError } from "../errors/requestValidation.errors";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err: any) {
      next(new RequestValidationError(err));
    }
  };

export default validate;

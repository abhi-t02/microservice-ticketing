import { ZodError } from "zod";
import { CustomError } from "./customError.errors";

export class RequestValidationError extends CustomError {
  statusCode: number = 400;
  constructor(public errors: ZodError) {
    super("Request validation error");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.errors.map((error) => {
      return { message: error.message, field: error.path[1] };
    });
  }
}

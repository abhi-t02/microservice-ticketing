import { CustomError } from "./customError.errors";

export class NotFoundError extends CustomError {
  statusCode: number = 404;

  constructor() {
    super("resource not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): {
    message: string;
    field?: string | number | undefined;
  }[] {
    return [{ message: "Not Found" }];
  }
}

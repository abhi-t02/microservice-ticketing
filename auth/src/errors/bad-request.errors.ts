import { CustomError } from "./customError.errors";

export class BadRequestError extends CustomError {
  statusCode: number = 400;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): {
    message: string;
    field?: string | number | undefined;
  }[] {
    return [{ message: this.message }];
  }
}

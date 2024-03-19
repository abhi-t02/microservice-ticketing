import { CustomError } from "./customError.errors";

export class NotAuthorizedError extends CustomError {
  statusCode: number = 401;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): {
    message: string;
    field?: string | number | undefined;
  }[] {
    return [
      {
        message: "Not Authorized",
      },
    ];
  }
}

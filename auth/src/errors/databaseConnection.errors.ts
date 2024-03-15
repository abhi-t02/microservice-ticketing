import { CustomError } from "./customError.errors";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  error = "Error connecting to database.";
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.error }];
  }
}

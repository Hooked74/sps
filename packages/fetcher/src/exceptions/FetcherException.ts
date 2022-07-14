import { StatusCodes } from "http-status-codes";

export class FetcherException implements Error {
  public name = "FetcherException";
  public message = "Произошла неизвестная ошибка";
  public stack = new Error().stack;
  public createdAt = new Date();
  public status = StatusCodes.BAD_REQUEST;

  constructor(public readonly originalError: Error) {
    if (originalError?.message) this.message = originalError.message;
    if (originalError?.stack) this.stack = originalError.stack;
  }

  public toString() {
    return this.stack;
  }
}

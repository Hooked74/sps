import { StatusCodes } from "http-status-codes";
import { FetcherException } from ".";

export class ValidationResponseException extends FetcherException {
  public name = "ValidationResponseException";
  public status = StatusCodes.BAD_GATEWAY;
}

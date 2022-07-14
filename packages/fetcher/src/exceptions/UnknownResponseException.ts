import { StatusCodes } from "http-status-codes";
import { FetcherException } from ".";

export class UnknownResponseException extends FetcherException {
  public name = "UnknownResponseException";
  public status = StatusCodes.INTERNAL_SERVER_ERROR;
}

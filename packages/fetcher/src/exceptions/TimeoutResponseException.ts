import { StatusCodes } from "http-status-codes";
import { FetcherException } from ".";

export class TimeoutResponseException extends FetcherException {
  public name = "TimeoutResponseException";
  public status = StatusCodes.GATEWAY_TIMEOUT;
}

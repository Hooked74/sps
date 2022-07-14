import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { FetcherException } from ".";

export class AxiosResponseException<ResponseData = any> extends FetcherException {
  public name = "AxiosResponseException";
  public status = StatusCodes.INTERNAL_SERVER_ERROR;
  public responseData: ResponseData;

  constructor(public readonly originalError: AxiosError) {
    super(originalError);

    if (Number.isFinite(originalError?.response?.status)) {
      this.status = originalError.response.status;
    }
    if (originalError?.response?.data) {
      this.responseData = originalError.response.data;
    }
  }
}

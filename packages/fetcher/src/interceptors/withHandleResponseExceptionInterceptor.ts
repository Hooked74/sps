import {
  AxiosResponseException,
  FetcherException,
  TimeoutResponseException,
  UnknownResponseException,
  ValidationResponseException,
} from "../exceptions";
import { ValidationException } from "@h74-sps/validation";
import { fetcherLogger } from "../utils";
import { AxiosStatic } from "axios";

export const withHandleResponseExceptionInterceptor = (axios: AxiosStatic) => {
  axios.interceptors.response.use(null, (exception) => {
    let responseException: FetcherException;

    switch (true) {
      case axios.isCancel(exception):
        return Promise.resolve({
          data: null,
          status: null,
          statusText: null,
          headers: {},
          config: {},
          request: {},
        });
      case exception?.code === "ECONNABORTED":
        responseException = new TimeoutResponseException(exception);
        break;
      case axios.isAxiosError(exception):
        responseException = new AxiosResponseException(exception);
        break;
      case exception instanceof ValidationException:
        responseException = new ValidationResponseException(exception);
        break;
      default:
        responseException = new UnknownResponseException(exception);
    }

    fetcherLogger.error(responseException);

    return Promise.reject(responseException);
  });
};

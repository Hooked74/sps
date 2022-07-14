import { AxiosError as AxiosException } from "axios";
import { AxiosRequestException } from "../exceptions";
import { fetcherLogger } from "../utils";
import { AxiosStatic } from "axios";

export const withHandleRequestExceptionInterceptor = (axios: AxiosStatic) => {
  axios.interceptors.request.use(null, (exception: AxiosException) => {
    const axiosRequestException = new AxiosRequestException(exception);
    fetcherLogger.error(axiosRequestException);

    return Promise.reject(axiosRequestException);
  });
};

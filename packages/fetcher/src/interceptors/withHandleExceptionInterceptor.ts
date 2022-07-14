import { AxiosStatic } from "axios";
import {
  withConvertExceptionDataBlobToJsonInterceptor,
  withHandleRequestExceptionInterceptor,
  withHandleResponseExceptionInterceptor,
} from ".";

export const withHandleExceptionInterceptor = (axios: AxiosStatic) => {
  withConvertExceptionDataBlobToJsonInterceptor(axios);
  withHandleRequestExceptionInterceptor(axios);
  withHandleResponseExceptionInterceptor(axios);
};

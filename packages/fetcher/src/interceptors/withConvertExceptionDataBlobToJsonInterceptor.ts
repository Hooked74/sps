import { AxiosError as AxiosException, AxiosStatic } from "axios";
import { convertBlobToParsedJson } from "@h74-sps/utils";

export const withConvertExceptionDataBlobToJsonInterceptor = (axios: AxiosStatic) => {
  axios.interceptors.response.use(null, async (exception: AxiosException) => {
    if (
      exception.request?.responseType === "blob" &&
      exception.response.data instanceof Blob &&
      exception.response.data.type &&
      exception.response.data.type.toLowerCase().indexOf("json") > -1
    ) {
      return convertBlobToParsedJson(exception.response.data)
        .then((json) => {
          exception.response.data = json;
          return Promise.reject();
        })
        .catch(() => Promise.reject(exception));
    }

    return Promise.reject(exception);
  });
};

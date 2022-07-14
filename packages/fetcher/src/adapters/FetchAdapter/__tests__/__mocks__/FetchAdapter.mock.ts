import { AxiosRequestConfig } from "axios";

export const AXIOS_DEFAULT_CONFIG: AxiosRequestConfig = {
  method: "get",
  withCredentials: false,
  responseType: "json",
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
  maxRedirects: 5,
  socketPath: null,
  decompress: true,
  insecureHTTPParser: undefined,
  transitional: {
    silentJSONParsing: true,
  },
};

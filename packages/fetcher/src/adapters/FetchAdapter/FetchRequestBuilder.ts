import buildURL from "axios/lib/helpers/buildURL";
import buildFullPath from "axios/lib/core/buildFullPath";
import cookies from "axios/lib/helpers/cookies";
import isURLSameOrigin from "axios/lib/helpers/isURLSameOrigin";
import axiosUtils from "axios/lib/utils";
import { GlobalManager } from "@h74-sps/utils";
import { FetchAbortController } from "./FetchAbortController";
import { FetchAbortTypes } from "./FetchAdapter.const";
import { AxiosRequestConfig } from "axios";

export class FetchRequestBuilder {
  private fullPath: string;
  private method: RequestInit["method"];
  private url: string = "";
  private requestOptions: RequestInit = {};

  constructor(private readonly config: AxiosRequestConfig) {
    this.fullPath = buildFullPath(this.config.baseURL, this.config.url);
    this.method = this.config.method.toUpperCase();
  }

  public setUrl() {
    this.url = buildURL(this.fullPath, this.config.params, this.config.paramsSerializer);

    return this;
  }

  private verifyContentTypeHeader(headers: Headers) {
    if (axiosUtils.isFormData(this.config.data) || !this.config.data) {
      headers.delete("Content-Type");
    }
  }

  private setAuthHeader(headers: Headers) {
    if (this.config.auth) {
      const username = this.config.auth.username || "";
      const password = this.config.auth.password
        ? unescape(encodeURIComponent(this.config.auth.password))
        : "";

      headers.set("Authorization", `Basic ${GlobalManager.get("btoa")(username + ":" + password)}`);
    }
  }

  private setXsrfHeader(headers: Headers) {
    if (axiosUtils.isStandardBrowserEnv()) {
      const xsrfValue =
        (this.config.withCredentials || isURLSameOrigin(this.fullPath)) &&
        this.config.xsrfCookieName
          ? cookies.read(this.config.xsrfCookieName)
          : undefined;

      if (xsrfValue) headers.set(this.config.xsrfHeaderName, xsrfValue);
    }
  }

  public setHeaders() {
    const headers = new Headers(this.config.headers);

    this.verifyContentTypeHeader(headers);
    this.setAuthHeader(headers);
    this.setXsrfHeader(headers);

    this.requestOptions.headers = headers;

    return this;
  }

  public setMethod() {
    this.requestOptions.method = this.method;

    return this;
  }

  public setBody() {
    if (!["GET", "HEAD"].includes(this.method)) {
      this.requestOptions.body = this.config.data;
    }

    return this;
  }

  public setCredentials() {
    if (!axiosUtils.isUndefined(this.config.withCredentials)) {
      this.requestOptions.credentials = this.config.withCredentials ? "include" : "omit";
    }

    return this;
  }

  public setSignal(abortController: FetchAbortController) {
    this.requestOptions.signal = abortController.signal;

    if (this.config.timeout) {
      setTimeout(() => abortController.abort(FetchAbortTypes.TIMEOUT), this.config.timeout);
    }

    if (this.config.cancelToken) {
      this.config.cancelToken.promise.then(() => abortController.abort(FetchAbortTypes.CANCEL));
    }

    if (this.config.signal instanceof AbortSignal) {
      this.config.signal.addEventListener("abort", () =>
        abortController.abort(FetchAbortTypes.CANCEL)
      );
    }

    return this;
  }

  public setAdvancedRequestOptions() {
    (
      ["mode", "cache", "integrity", "redirect", "referrer", "referrerPolicy", "keepalive"] as const
    ).forEach((optionKey) => {
      if (this.config[optionKey]) {
        this.requestOptions[optionKey] = this.config[optionKey] as never;
      }
    });

    return this;
  }

  public build() {
    return new Request(this.url, this.requestOptions);
  }
}

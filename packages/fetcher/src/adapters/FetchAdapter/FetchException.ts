import { AxiosRequestConfig } from "axios";
import { FetchExceptionCode } from "./FetchAdapter.types";

export class FetchException<OriginalException> extends Error {
  public isAxiosError = true;
  public url: string;
  public name = "FetchException";

  constructor(
    message: string,
    public readonly code: FetchExceptionCode,
    public readonly originalException: OriginalException,
    public readonly config: AxiosRequestConfig,
    public readonly request: Request
  ) {
    super(message);
    this.url = `${request.method} ${request.url}`;
  }

  public toJSON() {
    return {
      url: this.url,
      message: this.message,
      name: this.name,
      stack: this.stack,
      config: this.config,
      request: {
        cache: this.request.cache,
        credentials: this.request.credentials,
        destination: this.request.destination,
        headers: [...this.request.headers],
        integrity: this.request.integrity,
        keepalive: this.request.keepalive,
        method: this.request.method,
        mode: this.request.mode,
        redirect: this.request.redirect,
        referrer: this.request.referrer,
        referrerPolicy: this.request.referrerPolicy,
        signal: { aborted: this.request.signal.aborted },
        url: this.request.url,
      },
    };
  }
}

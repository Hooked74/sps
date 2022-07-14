/* eslint-disable no-fallthrough */
import createHttpException from "http-errors";
import { AxiosRequestConfig } from "axios";
import { FetchAbortController } from "./FetchAbortController";
import { FetchAbortTypes } from "./FetchAdapter.const";
import { CreateFetchException } from "./FetchAdapter.types";

export class FetchExceptionFilter {
  constructor(
    private readonly config: AxiosRequestConfig,
    private readonly createFetchException: CreateFetchException,
    private readonly asyncAbortType: Promise<FetchAbortTypes>
  ) {}

  private handleCancelException(exception: DOMException) {
    throw this.createFetchException("Request aborted", "ECONNABORTED", exception);
  }

  private handleTimeoutException(exception: DOMException) {
    throw this.createFetchException(
      this.config.timeoutErrorMessage ?? `Timeout of ${this.config.timeout} ms exceeded`,
      this.config.transitional?.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
      exception
    );
  }

  private handleAbortException(exception: DOMException, abortType: FetchAbortTypes) {
    switch (abortType) {
      case FetchAbortTypes.CANCEL:
        this.handleCancelException(exception);
      case FetchAbortTypes.TIMEOUT:
        this.handleTimeoutException(exception);
    }
  }

  private handleResponseException(exception: Response) {
    throw this.createFetchException(
      exception.statusText || createHttpException(exception.status)?.message,
      exception.status,
      exception
    );
  }

  private handleNetworkException(exception: Error) {
    throw this.createFetchException(exception.message, null, exception);
  }

  private handleUnknownNetworkException(exception: unknown) {
    throw this.createFetchException("Unknown network exception", null, exception);
  }

  public captureException = async (exception: unknown) => {
    switch (true) {
      case FetchAbortController.isAbortException(exception as DOMException):
        this.handleAbortException(exception as DOMException, await this.asyncAbortType);
      case exception instanceof Response:
        this.handleResponseException(exception as Response);
      case exception instanceof Error:
        this.handleNetworkException(exception as Error);
      default:
        this.handleUnknownNetworkException(exception);
    }
  };
}

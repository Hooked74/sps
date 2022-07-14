import { AxiosPromise, AxiosRequestConfig } from "axios";
import { FetchAbortController } from "./FetchAbortController";
import { AbortTypeResolver, CreateFetchException, FetchExceptionCode } from "./FetchAdapter.types";
import { FetchRequestBuilder } from "./FetchRequestBuilder";
import { FetchException } from "./FetchException";
import { FetchAbortTypes } from "./FetchAdapter.const";
import { FetchExceptionFilter } from "./FetchExceptionFilter";
import xhrAdapter from "axios/lib/adapters/xhr";
import { FetchResponseManager } from "./FetchResponseManager";

class FetchAdapter {
  constructor(private readonly config: AxiosRequestConfig) {}

  private createFetchRequest(abortController: FetchAbortController) {
    return new FetchRequestBuilder(this.config)
      .setUrl()
      .setHeaders()
      .setMethod()
      .setBody()
      .setCredentials()
      .setSignal(abortController)
      .setAdvancedRequestOptions()
      .build();
  }

  private createFetchExceptionFunction(fetchRequest: Request) {
    return <OriginalException>(
      message: string,
      code: FetchExceptionCode,
      originalException: OriginalException
    ) =>
      new FetchException<OriginalException>(
        message,
        code,
        originalException,
        this.config,
        fetchRequest
      );
  }

  private createAsyncAbortType() {
    let abortTypeResolver: AbortTypeResolver;
    const asyncAbortType: Promise<FetchAbortTypes> = new Promise(
      (resolve) => (abortTypeResolver = resolve)
    );

    return { abortTypeResolver, asyncAbortType };
  }

  private createAbortController(abortTypeResolver: AbortTypeResolver) {
    return new FetchAbortController(abortTypeResolver);
  }

  private createFetchExceptionHandler(
    createFetchException: CreateFetchException,
    asyncAbortType: Promise<FetchAbortTypes>
  ) {
    return new FetchExceptionFilter(this.config, createFetchException, asyncAbortType);
  }

  private createFetchResponseManager() {
    return new FetchResponseManager(this.config);
  }

  private requestFallback() {
    return xhrAdapter(this.config);
  }

  public async request<ResponseData = any>() {
    if (typeof this.config.onUploadProgress === "function") {
      return this.requestFallback();
    }

    const { abortTypeResolver, asyncAbortType } = this.createAsyncAbortType();
    const abortController = this.createAbortController(abortTypeResolver);
    const fetchRequest = this.createFetchRequest(abortController);
    const createFetchException = this.createFetchExceptionFunction(fetchRequest);
    const fetchExceptionHandler = this.createFetchExceptionHandler(
      createFetchException,
      asyncAbortType
    );
    const fetchResponseManager = this.createFetchResponseManager();

    return await (fetch(fetchRequest)
      .then(fetchResponseManager.validateStatus)
      .then(fetchResponseManager.handleDownloadProgress)
      .then(fetchResponseManager.formatResponse(fetchRequest))
      .catch(fetchExceptionHandler.captureException) as AxiosPromise<ResponseData>);
  }
}

export const fetchAdapter = <ResponseData = any>(config: AxiosRequestConfig) =>
  new FetchAdapter(config).request<ResponseData>();

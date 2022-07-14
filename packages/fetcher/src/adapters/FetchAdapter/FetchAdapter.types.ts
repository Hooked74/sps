import { FetchAbortTypes } from "./FetchAdapter.const";
import { FetchException } from "./FetchException";

export type FetchExceptionCode = string | number;

export type CreateFetchException = <OriginalException>(
  message: string,
  code: FetchExceptionCode,
  originalException: OriginalException
) => FetchException<OriginalException>;

export type AbortTypeResolver = (abortType: FetchAbortTypes) => void;

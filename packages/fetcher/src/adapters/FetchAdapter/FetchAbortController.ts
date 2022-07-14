import { FetchAbortTypes } from "./FetchAdapter.const";
import { AbortTypeResolver } from "./FetchAdapter.types";

export class FetchAbortController extends AbortController {
  public static isAbortException(exception: DOMException) {
    return exception.code === DOMException.ABORT_ERR || exception.name === "AbortError";
  }

  constructor(private readonly abortTypeResolver: AbortTypeResolver) {
    super();
  }

  public abort(abortType?: FetchAbortTypes) {
    this.abortTypeResolver(abortType);
    super.abort();
  }
}

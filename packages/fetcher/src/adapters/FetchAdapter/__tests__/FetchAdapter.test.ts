import { fetchAdapter } from "../FetchAdapter";
import { NotFound as NotFoundException } from "http-errors";
import { AXIOS_DEFAULT_CONFIG } from "./__mocks__/FetchAdapter.mock";
import axios, { AxiosRequestConfig } from "axios";
import buildURL from "axios/lib/helpers/buildURL";
import { FetchException } from "../FetchException";
import xhrAdapter from "axios/lib/adapters/xhr";

jest.mock("axios/lib/adapters/xhr");

describe("fetcher/adapters/FetchAdapter", () => {
  let fetchMock: jest.SpyInstance;
  const defaultStatus = 200;
  const defaultStatusText = "ok";
  const defaultBody = JSON.stringify({ key: "value" });

  beforeAll(() => {
    fetchMock = jest.spyOn(global, "fetch");
  });

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        new Response(defaultBody, {
          status: defaultStatus,
          statusText: defaultStatusText,
        })
      )
    );
  });

  it("Поля в response должны соответствовать заданному axios интерфейсу", async () => {
    const config: AxiosRequestConfig = {
      ...AXIOS_DEFAULT_CONFIG,
      url: fakerStatic.internet.url(),
      method: "post",
    };

    const response = await fetchAdapter(config);

    expectJest(response).toHaveProperty("status", defaultStatus);
    expectJest(response).toHaveProperty("statusText", defaultStatusText);
    expectJest(response).toHaveProperty("config", config);
    expectJest(response).toHaveProperty("data", JSON.parse(defaultBody));
    expectJest(response).toHaveProperty("headers");
    expectJest(response).toHaveProperty("request");
    expectJest(response.request).toBeInstanceOf(Request);
    expectJest(response.headers).toBeInstanceOf(Object);
  });

  describe("headers", () => {
    it("Должен передать в запрос заголовки из конфига", async () => {
      const customHeaderName = "X-Custom-Header";

      const config: AxiosRequestConfig = {
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        headers: {
          [customHeaderName]: fakerStatic.lorem.text(1),
        },
      };

      const { request } = await fetchAdapter(config);

      expectJest(request.headers.get(customHeaderName)).toBe(config.headers[customHeaderName]);
    });

    it("Должен удалить заголовок Content-Type в запросе, если нет body", async () => {
      const config: AxiosRequestConfig = {
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { request } = await fetchAdapter(config);

      expectJest(request.headers.has("Content-Type")).toBeFalsy();
    });

    it("Должен удалить заголовок Content-Type в запросе, если в body FormData", async () => {
      const config: AxiosRequestConfig = {
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: new FormData(),
      };

      const { request } = await fetchAdapter(config);

      expectJest(request.headers.has("Content-Type")).toBeFalsy();
    });

    it("Должен оставить заголовок Content-Type в запросе, если body – json", async () => {
      const config: AxiosRequestConfig = {
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: {},
      };

      const { request } = await fetchAdapter(config);

      expectJest(request.headers.has("Content-Type")).toBeTruthy();
    });

    it("Должен добавить заголовок Authorization в запросе, если есть заголовок auth", async () => {
      const config: AxiosRequestConfig = {
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        auth: {
          password: fakerStatic.internet.password(),
          username: fakerStatic.internet.userName(),
        },
      };

      const { request } = await fetchAdapter(config);

      expectJest(request.headers.has("Authorization")).toBeTruthy();
    });

    it("Должен добавить заголовок xsrfHeaderName со значением куки xsrfCookieName, если запрос не кросс-доменный", async () => {
      const url = "http://localhost/";
      const xsrfCookieName = fakerStatic.lorem.words(1);
      const xsrfHeaderName = fakerStatic.lorem.words(1);
      const xsrfHeaderValue = fakerStatic.lorem.words(1);

      const cookieSpy = jest.spyOn(document, "cookie", "get");
      cookieSpy.mockImplementation(() => `${xsrfCookieName}=${xsrfHeaderValue}`);

      const config: AxiosRequestConfig = {
        ...AXIOS_DEFAULT_CONFIG,
        url,
        xsrfCookieName,
        xsrfHeaderName,
      };

      const { request } = await fetchAdapter(config);

      expectJest(request.headers.has(xsrfHeaderName)).toBe(true);
      expectJest(request.headers.get(xsrfHeaderName)).toBe(xsrfHeaderValue);

      cookieSpy.mockRestore();
    });

    it("Должен добавить заголовок xsrfHeaderName со значением куки xsrfCookieName, если указан withCredentials", async () => {
      const xsrfCookieName = fakerStatic.lorem.words(1);
      const xsrfHeaderName = fakerStatic.lorem.words(1);
      const xsrfHeaderValue = fakerStatic.lorem.words(1);

      const cookieSpy = jest.spyOn(document, "cookie", "get");
      cookieSpy.mockImplementation(() => `${xsrfCookieName}=${xsrfHeaderValue}`);

      const config: AxiosRequestConfig = {
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        withCredentials: true,
        xsrfCookieName,
        xsrfHeaderName,
      };

      const { request } = await fetchAdapter(config);

      expectJest(request.headers.has(xsrfHeaderName)).toBe(true);
      expectJest(request.headers.get(xsrfHeaderName)).toBe(xsrfHeaderValue);

      cookieSpy.mockRestore();
    });
  });

  describe("validateStatus", () => {
    it("Должен отработать без исключений при validateStatus = true", () => {
      expectJest(
        fetchAdapter({
          ...AXIOS_DEFAULT_CONFIG,
          validateStatus: () => true,
          url: fakerStatic.internet.url(),
        })
      ).resolves.not.toThrowError();
    });

    it("Должен выбросить исключение при validateStatus = false", () => {
      expectJest(
        fetchAdapter({
          ...AXIOS_DEFAULT_CONFIG,
          validateStatus: (status) => status !== 200,
          url: fakerStatic.internet.url(),
        })
      ).rejects.toThrowError();
    });
  });

  describe("baseURL", () => {
    it("Должен учитываться baseUrl при относительном url", async () => {
      const baseURL = fakerStatic.internet.url();
      const url = "/users";

      const response = await fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url,
        baseURL,
      });

      expectJest(response.request.url).toBe(`${baseURL}${url}`);
    });

    it("Не должен учитываться baseUrl при абсолютном url", async () => {
      const baseURL = fakerStatic.internet.url();
      const url = fakerStatic.internet.url();

      const response = await fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url,
        baseURL,
      });

      expectJest(response.request.url).toBe(url);
    });
  });

  describe("Прерывания запросов - timeout, signal, exception", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      fetchMock.mockImplementation((request: Request) => {
        let rejectFn: Handler;
        const promise = new Promise((_, reject) => {
          rejectFn = reject;
        });

        request.signal.onabort = () => {
          const error = new Error();
          (error as any).code = DOMException.ABORT_ERR;
          (error as any).name = "AbortError";
          rejectFn(error);
        };
        return promise;
      });
    });

    it("Должен прервать исполнение с исключением по timeout", () => {
      const result = fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        timeout: 1,
      });

      expectJest(result).rejects.toThrowError(`Timeout of 1 ms exceeded`);
      expectJest(result).rejects.toThrow(FetchException);
    });

    it("Должен прервать исполнение с исключением по timeout с ошибкой ETIMEDOUT вместо ECONNABORTED", async () => {
      let err: FetchException<Error>;

      try {
        await fetchAdapter({
          ...AXIOS_DEFAULT_CONFIG,
          url: fakerStatic.internet.url(),
          timeout: 1,
          transitional: {
            clarifyTimeoutError: true,
          },
        });
      } catch (e: any) {
        err = e;
      }

      expectJest(err.code).toBe("ETIMEDOUT");
    });

    it("Должен прервать исполнение по CancelToken", () => {
      const cancelTokenSource = axios.CancelToken.source();

      const result = fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        cancelToken: cancelTokenSource.token,
      });

      cancelTokenSource.cancel();

      expectJest(result).rejects.toThrowError("Request aborted");
      expectJest(result).rejects.toThrow(FetchException);
    });

    it("Должен прервать исполнение всех запросов с исключением по внешнему AbortController'у", async () => {
      const abortController = new AbortController();
      const mockFn = jest.fn();

      const config = {
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        signal: abortController.signal,
      };
      const promises = [fetchAdapter(config).catch(mockFn), fetchAdapter(config).catch(mockFn)];
      abortController.abort();

      await Promise.all(promises);

      expectJest(mockFn).toHaveBeenCalledTimes(2);
      expectJest(mockFn.mock.calls[0][0].message).toBe("Request aborted");
      expectJest(mockFn.mock.calls[0][0]).toBeInstanceOf(FetchException);
      expectJest(mockFn.mock.calls[1][0].message).toBe("Request aborted");
      expectJest(mockFn.mock.calls[1][0]).toBeInstanceOf(FetchException);
    });

    it('Должен выбросить исключение "Not Found"', async () => {
      fetchMock.mockImplementation(() => Promise.reject(new NotFoundException()));

      const result = fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
      });

      expectJest(result).rejects.toThrowError("Not Found");
      expectJest(result).rejects.toThrow(FetchException);
    });
  });

  describe("params, paramsSerializer", () => {
    it("Должен сформировать правильный url с параметрами", async () => {
      const url = fakerStatic.internet.url();
      const params = {
        str: fakerStatic.name.firstName(),
        arr: [fakerStatic.datatype.number(), fakerStatic.datatype.number()],
        num: fakerStatic.datatype.number(),
        bool: fakerStatic.datatype.boolean(),
      };

      const response = await fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url,
        params,
      });

      expectJest(response.request.url).toBe(buildURL(url, params));
    });

    it("Должен сформировать правильный url с параметрами используя функцию paramsSerializer", async () => {
      const url = fakerStatic.internet.url();
      const params = {
        str: fakerStatic.name.firstName(),
      };
      const serializedParams = `str=${fakerStatic.name.lastName()}`;

      const response = await fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url,
        params,
        paramsSerializer: () => serializedParams,
      });

      expectJest(response.request.url).toBe(`${url}?${serializedParams}`);
    });
  });

  describe("responseType", () => {
    it('Должен вернуть текст в ответе при responseType: "json"', async () => {
      const response = await fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        responseType: "text",
      });

      expectJest(response.data).toBe(defaultBody);
    });

    it('Должен вернуть json object в ответе при responseType: "json"', async () => {
      const response = await fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        responseType: "json",
      });

      expectJest(response.data).toStrictEqual(JSON.parse(defaultBody));
    });

    it('Должен вернуть Blob в ответе при responseType: "blob"', async () => {
      const data = new Blob([fakerStatic.lorem.words(1)], { type: "text/plain" });

      fetchMock.mockImplementation(() =>
        Promise.resolve(
          new Response(data, {
            status: defaultStatus,
            statusText: defaultStatusText,
          })
        )
      );

      const response = await fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        responseType: "blob",
      });

      expectJest(response.data).toBe(data);
    });

    it("Должен выбросить исключение при несоответствии типов ответа и responseType", () => {
      const data = new Blob([fakerStatic.lorem.words(1)], { type: "text/plain" });

      fetchMock.mockImplementation(() =>
        Promise.resolve(
          new Response(data, {
            status: defaultStatus,
            statusText: defaultStatusText,
          })
        )
      );

      const response = fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        responseType: "json",
      });

      expectJest(response).rejects.toThrowError(FetchException);
    });
  });

  describe("progress", () => {
    it("Должен сделать запрос через xhr если передать коллбэк onUploadProgress", async () => {
      const mockXhrAdapter = xhrAdapter as jest.MockedFunction<typeof xhrAdapter>;

      await fetchAdapter({
        ...AXIOS_DEFAULT_CONFIG,
        url: fakerStatic.internet.url(),
        onUploadProgress: () => {},
      });

      expectJest(mockXhrAdapter).toHaveBeenCalled();
    });
  });
});

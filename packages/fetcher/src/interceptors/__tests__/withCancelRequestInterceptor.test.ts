import { expect } from "@jest/globals";
import { withCancelRequestInterceptor } from "..";
import MockAdapter from "axios-mock-adapter";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";

describe("fetcher/interceptors/withCancelRequestInterceptor", () => {
  let mockAxios: MockAdapter;
  let ejectInterceptor: Handler;
  const mockUrl = fakerStatic.internet.url();
  const responseDataMock = {
    user: { id: fakerStatic.datatype.number(), name: fakerStatic.name.firstName() },
  };

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    ejectInterceptor = withCancelRequestInterceptor(axios);
  });

  afterEach(() => {
    ejectInterceptor?.();
  });

  it("Должен сработать cancel при вызове onCancel", async () => {
    let error: Error;
    ejectInterceptor = ejectInterceptor({
      condition: (config: AxiosRequestConfig) => Boolean(config.headers["X-Condition"]),
      onCancel(source: CancelTokenSource) {
        source.cancel();
      },
    });

    mockAxios.onGet(mockUrl).reply(200, {});

    try {
      await axios.get(mockUrl, { headers: { "X-Condition": "true" } });
    } catch (e: any) {
      error = e;
    }

    expect(error).toBeInstanceOf(axios.Cancel);
  });

  it("Должен сработать cancel при передаче forceCancel", async () => {
    let error: Error;
    ejectInterceptor = ejectInterceptor({
      condition: () => true,
      forceCancel: true,
    });

    mockAxios.onGet(mockUrl).reply(200, {});

    try {
      await axios.get(mockUrl);
    } catch (e: any) {
      error = e;
    }

    expect(error).toBeInstanceOf(axios.Cancel);
  });

  it("Должен сработать cancel только при первом запросе", async () => {
    let error: Error;
    mockAxios.onGet(mockUrl).reply(200, responseDataMock);

    ejectInterceptor = ejectInterceptor({
      condition: (config: AxiosRequestConfig) => config,
      once: true,
      forceCancel: true,
    });

    try {
      await axios.get(mockUrl, {});
    } catch (e: any) {
      error = e;
    }
    const response = await axios.get(mockUrl);

    expect(error).toBeInstanceOf(axios.Cancel);
    expect(response.data).toEqual(responseDataMock);
  });

  it("Должен успешно выполниться запрос", async () => {
    ejectInterceptor = ejectInterceptor({
      condition: () => false,
      forceCancel: true,
    });

    const response = await axios.get(mockUrl);

    expect(response.data).toEqual(responseDataMock);
  });
});

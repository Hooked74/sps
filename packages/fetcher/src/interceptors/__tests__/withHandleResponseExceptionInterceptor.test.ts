import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
  AxiosResponseException,
  TimeoutResponseException,
  ValidationResponseException,
} from "../../exceptions";
import { ValidationException } from "@h74-sps/validation";
import { withHandleResponseExceptionInterceptor } from "../withHandleResponseExceptionInterceptor";

describe("fetcher/interceptors/withHandleResponseExceptionInterceptor", () => {
  let mockAxios: MockAdapter;
  const mockUrl = fakerStatic.internet.url();

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
    withHandleResponseExceptionInterceptor(axios);
    jest.spyOn(console, "error");
  });

  it("Должно сработать исключение с типом AxiosResponseException", async () => {
    let error: AxiosResponseException;

    mockAxios.onGet(mockUrl).networkError();

    try {
      await axios.get(mockUrl);
    } catch (e: any) {
      error = e;
    }

    expectJest(error).toBeInstanceOf(AxiosResponseException);
    expectJest(error.originalError.isAxiosError).toBeTruthy();
  });

  it("Должно сработать исключение с типом TimeoutResponseException", async () => {
    let error: TimeoutResponseException;

    mockAxios.onGet(mockUrl).timeout();

    try {
      await axios.get(mockUrl);
    } catch (e: any) {
      error = e;
    }

    expectJest(error).toBeInstanceOf(TimeoutResponseException);
  });

  it("Должен вернуть пустой response при отмене запроса", async () => {
    const source = axios.CancelToken.source();
    const cancelToken = source.token;

    mockAxios.onGet(mockUrl).reply(200);

    const req = axios.get(mockUrl, { cancelToken });
    source.cancel();
    const response = await req.catch((err) => err);

    expectJest(response).toEqual({
      data: null,
      status: null,
      statusText: null,
      headers: {},
      config: {},
      request: {},
    });
  });

  it("Должно сработать исключение с типом ValidationResponseException", async () => {
    let error: ValidationResponseException;
    const validationException = new ValidationException("validation error", {}, {});

    mockAxios.onGet(mockUrl).reply(() => {
      throw validationException;
    });

    try {
      await axios.get(mockUrl);
    } catch (e: any) {
      error = e;
    }

    expectJest(error).toBeInstanceOf(ValidationResponseException);
    expectJest(error.originalError).toBe(validationException);
  });
});

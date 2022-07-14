import { expect } from "@jest/globals";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { withHandleRequestExceptionInterceptor } from "../withHandleRequestExceptionInterceptor";
import { AxiosRequestException } from "../../exceptions";

describe("fetcher/interceptors/withHandleRequestExceptionInterceptor", () => {
  let mockAxios: MockAdapter;
  const mockUrl = fakerStatic.internet.url();

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
    withHandleRequestExceptionInterceptor(axios);
    jest.spyOn(console, "error");
  });

  it("Должно сработать исключение с типом AxiosRequestException", async () => {
    let error: AxiosRequestException;
    const newError = new Error();

    axios.interceptors.request.use(() => {
      throw newError;
    });

    mockAxios.onGet(mockUrl);

    try {
      await axios.get(mockUrl);
    } catch (e: any) {
      error = e;
    }

    expect(error).toBeInstanceOf(AxiosRequestException);
    expect(error.originalError).toBe(newError);
  });
});

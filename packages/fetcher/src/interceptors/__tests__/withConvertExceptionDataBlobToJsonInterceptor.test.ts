import AxiosException from "axios/lib/core/AxiosError";
import MockAdapter from "axios-mock-adapter";
import axios, { AxiosError } from "axios";
import { withConvertExceptionDataBlobToJsonInterceptor } from "../withConvertExceptionDataBlobToJsonInterceptor";

describe("fetcher/interceptors/withConvertExceptionDataBlobToJsonInterceptor", () => {
  let mockAxios: MockAdapter;
  const mockUrl = fakerStatic.internet.url();
  const dataMock = {
    id: fakerStatic.datatype.number(),
    name: fakerStatic.name.firstName(),
  };

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
    withConvertExceptionDataBlobToJsonInterceptor(axios);
  });

  it("Должен сконвертировать, переданный в ошибке Blob, в JSON объект", async () => {
    let error: AxiosError;

    mockAxios.onGet(mockUrl).reply(function (config) {
      return Promise.reject(
        new AxiosException("error", config, 400, config, {
          data: new Blob([JSON.stringify(dataMock, null, 2)], { type: "application/json" }),
        })
      );
    });

    try {
      await axios.get(mockUrl, {
        responseType: "blob",
      });
    } catch (e: any) {
      error = e;
    }

    expectJest(error).toBeInstanceOf(Error);
    expectJest(error.isAxiosError).toBeTruthy();
    expectJest(error.response.data).toEqual(dataMock);
  });

  it("Должен вернуть, переданный в ошибке Blob, без конвертации в JSON", async () => {
    let error: AxiosError;

    mockAxios.onGet(mockUrl).reply(function (config) {
      return Promise.reject(
        new AxiosException("error", config, 400, config, {
          data: new Blob([JSON.stringify(dataMock, null, 2)], { type: "text/html" }),
        })
      );
    });

    try {
      await axios.get(mockUrl, {
        responseType: "blob",
      });
    } catch (e: any) {
      error = e;
    }

    expectJest(error).toBeInstanceOf(Error);
    expectJest(error.isAxiosError).toBeTruthy();
    expectJest(error.response.data).toBeInstanceOf(Blob);
  });
});

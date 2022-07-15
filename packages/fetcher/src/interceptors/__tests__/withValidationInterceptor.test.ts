import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import validation, { ValidationException } from "@h74-sps/validation";
import { withValidationInterceptor } from "..";

describe("fetcher/interceptors/withValidationInterceptor", () => {
  let mockAxios: MockAdapter;
  const mockUrl = fakerStatic.internet.url();
  const responseDataMock = {
    user: { id: fakerStatic.datatype.number(), name: fakerStatic.name.firstName() },
  };

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
    withValidationInterceptor(axios);
  });

  it("Должен корректно пройти переданную валидацию и вернуть response", async () => {
    mockAxios.onGet(mockUrl).reply(200, responseDataMock);

    const response = await axios.get(mockUrl, {
      validationSchema: validation
        .object({
          user: validation
            .object({ id: validation.number().required(), name: validation.string().required() })
            .required(),
        })
        .required(),
    });

    expectJest(response.data).toEqual(responseDataMock);
  });

  it("Должно сработать исключение при невалидных данных", async () => {
    let error: Error;
    mockAxios.onGet(mockUrl).reply(200, responseDataMock);

    try {
      await axios.get(mockUrl, {
        validationSchema: validation
          .object({
            user: validation
              .object({ id: validation.number().required(), name: validation.number().required() })
              .required(),
          })
          .required(),
      });
    } catch (e: any) {
      error = e;
    }

    expectJest(error).toBeInstanceOf(ValidationException);
  });
});

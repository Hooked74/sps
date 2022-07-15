import { ValidateResponse } from "../ValidateResponse";
import validation, { Schema } from "@h74-sps/validation";
import { AxiosRequestConfig } from "axios";

jest.mock("axios", () => {
  return { AxiosRequestConfig: class FetcherRequestConfig {} };
});

describe("fetcher/decorators/ValidateResponse", () => {
  const validationSchema = validation
    .object({
      user: validation
        .object({ id: validation.number().required(), name: validation.string().required() })
        .required(),
    })
    .required();

  it("Должен вернуть конфиг, в котором есть validationSchema", () => {
    class MockClass {
      @ValidateResponse(validationSchema)
      public mockMethod(config: AxiosRequestConfig) {
        return config;
      }
    }

    const config = new MockClass().mockMethod({});
    expectJest(config.validationSchema).toBe(validationSchema);
  });

  it("Должен вернуть конфиг, в котором нет validationSchema", () => {
    class MockRequestConfig {
      validationSchema?: Schema;
    }

    class MockClass {
      @ValidateResponse(validationSchema)
      public mockMethod(config: MockRequestConfig) {
        return config;
      }
    }

    const config = new MockClass().mockMethod({});
    expectJest(config.validationSchema).not.toBe(validationSchema);
  });

  it("Должен создать конфиг, в котором есть validationSchema, если конфиг не был явно передан", () => {
    class MockClass {
      @ValidateResponse(validationSchema)
      public mockMethod(config?: AxiosRequestConfig) {
        return config;
      }
    }

    const config = new MockClass().mockMethod();
    expectJest(config.validationSchema).toBe(validationSchema);
  });
});

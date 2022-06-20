import { PhoneNumberFormats } from "../../constants";
import { formatPhoneNumber } from "../formatPhoneNumber";
import { expect } from "@jest/globals";

describe("utils/helpers/formatPhoneNumber", () => {
  it("Должен вернуть +7 (939) 334-88-01", () => {
    expect(formatPhoneNumber("9393348801")).toBe("+7 (939) 334-88-01");
  });

  it("Должен вернуть +7 (939) 334-88-01", () => {
    expect(formatPhoneNumber("9393348801", PhoneNumberFormats.INTERNATIONAL)).toBe(
      "+7 (939) 334-88-01"
    );
  });

  it("Должен вернуть 8 939 334-88-01", () => {
    expect(formatPhoneNumber("9393348801", PhoneNumberFormats.LOCAL)).toBe("8 939 334-88-01");
  });
});

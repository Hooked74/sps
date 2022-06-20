import { GlobalManager } from "../GlobalManager";
import { expect } from "@jest/globals";

describe("utils/helpers/GlobalManager", () => {
  const mockKey = "GlobalManagerMock";
  const mockValue = "mock";

  it("Должен изменить глобальное значение", () => {
    GlobalManager.set(mockKey, mockValue);

    expect(GlobalManager.has(mockKey)).toBeTruthy();
  });

  it("Должен получить глобальное значение", () => {
    expect(GlobalManager.get(mockKey)).toEqual(mockValue);
  });

  it("Должен определить, что среда выполнения является сервером", () => {
    const windowSpy = jest.spyOn(window, "window", "get");
    windowSpy.mockImplementation(() => undefined);

    expect(GlobalManager.isClient()).toBeFalsy();
    expect(GlobalManager.isServer()).toBeTruthy();

    windowSpy.mockRestore();
  });

  it("Должен определить, что среда выполнения является клиентом", () => {
    const windowSpy = jest.spyOn(window, "window", "get");
    windowSpy.mockImplementation(() => ({} as typeof window));

    expect(GlobalManager.isClient()).toBeTruthy();
    expect(GlobalManager.isServer()).toBeFalsy();

    windowSpy.mockRestore();
  });
});

import { GlobalManager } from "../GlobalManager";

describe("utils/helpers/GlobalManager", () => {
  const mockKey = "GlobalManagerMock";
  const mockValue = "mock";

  it("Должен изменить глобальное значение", () => {
    GlobalManager.set(mockKey, mockValue);

    expectJest(GlobalManager.has(mockKey)).toBeTruthy();
  });

  it("Должен получить глобальное значение", () => {
    expectJest(GlobalManager.get(mockKey)).toEqual(mockValue);
  });

  it("Должен определить, что среда выполнения является сервером", () => {
    const windowSpy = jest.spyOn(window, "window", "get");
    windowSpy.mockImplementation(() => undefined);

    expectJest(GlobalManager.isClient()).toBeFalsy();
    expectJest(GlobalManager.isServer()).toBeTruthy();

    windowSpy.mockRestore();
  });

  it("Должен определить, что среда выполнения является клиентом", () => {
    const windowSpy = jest.spyOn(window, "window", "get");
    windowSpy.mockImplementation(() => ({} as typeof window));

    expectJest(GlobalManager.isClient()).toBeTruthy();
    expectJest(GlobalManager.isServer()).toBeFalsy();

    windowSpy.mockRestore();
  });
});

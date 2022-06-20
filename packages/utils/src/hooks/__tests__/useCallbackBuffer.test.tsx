import { expect } from "@jest/globals";
import { useCallbackBuffer } from "../useCallbackBuffer";

describe("utils/hooks/useCallbackBuffer", () => {
  it("Должен очистить буфер(вызвать все сохраненные в буфер функции с переданными аргументами)", () => {
    const mockFn = jest.fn();
    const fakeArgs = [fakerStatic.name.firstName(), fakerStatic.name.lastName()];
    const { result } = renderHook(() => useCallbackBuffer());

    result.current.push(mockFn, ...fakeArgs);
    result.current.push(mockFn, ...fakeArgs.slice().reverse());
    result.current.flush();

    expect(mockFn).toHaveBeenNthCalledWith(1, ...fakeArgs);
    expect(mockFn).toHaveBeenNthCalledWith(2, ...fakeArgs.reverse());
  });

  it("Не должен сбросить буфер во время rerender и должен очистить буфер с помощью flush после", () => {
    const mockFn = jest.fn();
    const fakeArgs = [fakerStatic.name.firstName(), fakerStatic.name.lastName()];
    const { result, rerender } = renderHook(() => useCallbackBuffer());

    result.current.push(mockFn, ...fakeArgs);
    result.current.push(mockFn, ...fakeArgs.slice().reverse());

    rerender();
    result.current.flush();

    expect(mockFn).toHaveBeenNthCalledWith(1, ...fakeArgs);
    expect(mockFn).toHaveBeenNthCalledWith(2, ...fakeArgs.reverse());
  });

  it("Должен очистить буфер, вызвав функцию без аргументов", () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => useCallbackBuffer());

    result.current.push(mockFn);
    result.current.flush();

    expect(mockFn).toHaveBeenCalledWith();
  });

  it("Должена произойти ошибка при очищении буфера", () => {
    const fakeErrorMessage = fakerStatic.random.words();
    const mockFn = jest.fn().mockImplementation(() => {
      throw new Error(fakeErrorMessage);
    });
    const { result } = renderHook(() => useCallbackBuffer());

    result.current.push(mockFn);

    expect(() => result.current.flush()).toThrowError(fakeErrorMessage);
  });
});

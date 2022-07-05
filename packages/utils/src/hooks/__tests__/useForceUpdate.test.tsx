import { useForceUpdate } from "../useForceUpdate";

describe("utils/hooks/useForceUpdate", () => {
  it("Должен обновить компонент после ручного вызова forceUpdate", () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => {
      mockFn();
      return useForceUpdate();
    });

    expectJest(mockFn).toHaveBeenCalledTimes(1);

    act(() => {
      result.current();
    });

    expectJest(mockFn).toHaveBeenCalledTimes(2);
  });
});

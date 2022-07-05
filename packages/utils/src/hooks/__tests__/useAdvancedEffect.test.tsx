import { useAdvancedEffect } from "../useAdvancedEffect";
import { useState } from "react";

describe("utils/hooks/useAdvancedEffect", () => {
  it("Должен вызвать callback в useEffect", () => {
    const callback = jest.fn();

    const { rerender, result } = renderHook(() => useAdvancedEffect(callback, []));

    expectJest(callback).toHaveBeenCalledTimes(1);
    expectJest(result.current.isMountRef.current).toBe(true);
    expectJest(result.current.isUpdateRef.current).toBe(false);
    expectJest(result.current.isOnceCall.current).toBe(true);

    rerender();

    expectJest(callback).toHaveBeenCalledTimes(1);
    expectJest(result.current.isUpdateRef.current).toBe(false);
  });

  it("Должен вызвать callback при маунте и каждом ререндере", () => {
    const callback = jest.fn();

    const { rerender, result } = renderHook(() => useAdvancedEffect(callback));

    expectJest(callback).toHaveBeenCalledTimes(1);
    expectJest(result.current.isMountRef.current).toBe(true);
    expectJest(result.current.isUpdateRef.current).toBe(false);
    expectJest(result.current.isOnceCall.current).toBe(true);

    rerender();

    expectJest(callback).toHaveBeenCalledTimes(2);
    expectJest(result.current.isUpdateRef.current).toBe(true);

    rerender();

    expectJest(callback).toHaveBeenCalledTimes(3);
  });

  it("Должен вызвать callback 1 раз при маунте", () => {
    const callback = jest.fn();

    const { rerender } = renderHook(() => useAdvancedEffect(callback, undefined, { once: true }));

    expectJest(callback).toHaveBeenCalledTimes(1);

    rerender();

    expectJest(callback).toHaveBeenCalledTimes(1);
  });

  it("Должен вызывать callback на didUpdate", () => {
    const callback = jest.fn();

    const { result } = renderHook(() => {
      const [mock, setMock] = useState(Math.random());
      useAdvancedEffect(callback, [mock], { didUpdate: true });

      return { setMock };
    });

    expectJest(callback).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.setMock(Math.random());
    });

    expectJest(callback).toHaveBeenCalledTimes(1);
  });

  it("Должен вызывать callback на didUpdate 1 раз", () => {
    const callback = jest.fn();

    const { rerender } = renderHook(() =>
      useAdvancedEffect(callback, undefined, { didUpdate: true, once: true })
    );

    expectJest(callback).toHaveBeenCalledTimes(0);

    rerender();

    expectJest(callback).toHaveBeenCalledTimes(1);

    rerender();

    expectJest(callback).toHaveBeenCalledTimes(1);
  });

  it("Должен вызывать callback при unmount", () => {
    const unmountCallback = jest.fn();

    const { unmount, result } = renderHook(() =>
      useAdvancedEffect(() => void 0, [], { unmountCallback })
    );

    unmount();

    expectJest(unmountCallback).toHaveBeenCalledTimes(1);
    expectJest(result.current.isMountRef.current).toBe(false);
    expectJest(result.current.isUpdateRef.current).toBe(false);
    expectJest(result.current.isOnceCall.current).toBe(false);
  });
});

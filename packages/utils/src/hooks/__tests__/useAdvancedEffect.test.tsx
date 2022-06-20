import { useAdvancedEffect } from "../useAdvancedEffect";
import { useState } from "react";
import { expect } from "@jest/globals";

describe("utils/hooks/useAdvancedEffect", () => {
  it("Должен вызвать callback в useEffect", () => {
    const callback = jest.fn();

    const { rerender, result } = renderHook(() => useAdvancedEffect(callback, []));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current.isMountRef.current).toBe(true);
    expect(result.current.isUpdateRef.current).toBe(false);
    expect(result.current.isOnceCall.current).toBe(true);

    rerender();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current.isUpdateRef.current).toBe(false);
  });

  it("Должен вызвать callback при маунте и каждом ререндере", () => {
    const callback = jest.fn();

    const { rerender, result } = renderHook(() => useAdvancedEffect(callback));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current.isMountRef.current).toBe(true);
    expect(result.current.isUpdateRef.current).toBe(false);
    expect(result.current.isOnceCall.current).toBe(true);

    rerender();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(result.current.isUpdateRef.current).toBe(true);

    rerender();

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("Должен вызвать callback 1 раз при маунте", () => {
    const callback = jest.fn();

    const { rerender } = renderHook(() => useAdvancedEffect(callback, undefined, { once: true }));

    expect(callback).toHaveBeenCalledTimes(1);

    rerender();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("Должен вызывать callback на didUpdate", () => {
    const callback = jest.fn();

    const { result } = renderHook(() => {
      const [mock, setMock] = useState(Math.random());
      useAdvancedEffect(callback, [mock], { didUpdate: true });

      return { setMock };
    });

    expect(callback).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.setMock(Math.random());
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("Должен вызывать callback на didUpdate 1 раз", () => {
    const callback = jest.fn();

    const { rerender } = renderHook(() =>
      useAdvancedEffect(callback, undefined, { didUpdate: true, once: true })
    );

    expect(callback).toHaveBeenCalledTimes(0);

    rerender();

    expect(callback).toHaveBeenCalledTimes(1);

    rerender();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("Должен вызывать callback при unmount", () => {
    const unmountCallback = jest.fn();

    const { unmount, result } = renderHook(() =>
      useAdvancedEffect(() => void 0, [], { unmountCallback })
    );

    unmount();

    expect(unmountCallback).toHaveBeenCalledTimes(1);
    expect(result.current.isMountRef.current).toBe(false);
    expect(result.current.isUpdateRef.current).toBe(false);
    expect(result.current.isOnceCall.current).toBe(false);
  });
});

import { useResizeEffect } from "../useResizeEffect";
import { setTimeout } from "timers/promises";

describe("utils/hooks/useResizeEffect", () => {
  let unmount: () => void;

  afterEach(() => {
    unmount();
  });

  it("Должен вызвать callback после инициализации хука", () => {
    const mockFn = jest.fn();
    unmount = renderHook(() => {
      useResizeEffect(mockFn);
    }).unmount;

    expectJest(mockFn).toHaveBeenCalledTimes(1);
  });

  it("Callback не должен вызваться сразу после инициализации хука", () => {
    const mockFn = jest.fn();
    unmount = renderHook(() => {
      useResizeEffect(mockFn, { instant: false });
    }).unmount;

    expectJest(mockFn).toHaveBeenCalledTimes(0);
  });

  it("Должен вызвать callback после диспатчинга события resize", () => {
    const mockFn = jest.fn();
    unmount = renderHook(() => {
      useResizeEffect(mockFn, { instant: false });
    }).unmount;

    window.dispatchEvent(new Event("resize"));

    expectJest(mockFn).toHaveBeenCalledTimes(1);
    expectJest(mockFn).toHaveBeenCalledWith();
  });

  it("Должен вызвать callback после диспатчинга события orientationchange", () => {
    const mockFn = jest.fn();
    unmount = renderHook(() => {
      useResizeEffect(mockFn, { instant: false });
    }).unmount;

    window.dispatchEvent(new Event("orientationchange"));

    expectJest(mockFn).toHaveBeenCalledTimes(1);
    expectJest(mockFn).toHaveBeenCalledWith();
  });

  it("Должен вызвать callback на каждое событие", () => {
    const mockFn = jest.fn();
    unmount = renderHook(() => {
      useResizeEffect(mockFn, { instant: false, delay: 0 });
    }).unmount;

    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("orientationchange"));

    expectJest(mockFn).toHaveBeenCalledTimes(2);
  });

  const delay = 150;
  it(`Должен отработать тротлинг ${delay}ms`, async () => {
    const mockFn = jest.fn();
    unmount = renderHook(() => {
      useResizeEffect(mockFn, { instant: false, delay });
    }).unmount;

    window.dispatchEvent(new Event("resize"));

    await setTimeout(Math.max(0, delay - 100));
    window.dispatchEvent(new Event("orientationchange"));

    expectJest(mockFn).toHaveBeenCalledTimes(1);
  });

  it(`Должен уничтожить обработчики после вызова unmount компонента`, () => {
    const mockFn = jest.fn();
    unmount = renderHook(() => {
      useResizeEffect(mockFn, { instant: false, delay });
    }).unmount;

    window.dispatchEvent(new Event("resize"));
    expectJest(mockFn).toHaveBeenCalledTimes(1);

    unmount();

    window.dispatchEvent(new Event("resize"));
    expectJest(mockFn).toHaveBeenCalledTimes(1);
  });
});

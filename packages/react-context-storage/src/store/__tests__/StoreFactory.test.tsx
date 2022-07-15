import {
  ComponentType,
  useEffect,
  ReactElement,
  useRef,
  MutableRefObject,
  ComponentProps,
} from "react";
import { create, ReactTestRenderer } from "react-test-renderer";
import {
  createMockStore,
  InitialState,
  MockStore,
  MockStoreValue,
} from "./__mocks__/StoreFactory.mock";
import { expect } from "@jest/globals";

jest.mock("../../devtools", () => {
  class DevtoolsStoreDecorator {
    decorateStoreProvider(StoreProvider: any) {
      return StoreProvider;
    }

    decorateStoreReducer(reducer: any) {
      return reducer;
    }
  }

  return { DevtoolsStoreDecorator };
});

describe("react-context-storage/store/StoreFactory", () => {
  let mockStore: MockStore;
  let consoleWarnMock: jest.SpyInstance;

  beforeAll(() => {
    consoleWarnMock = jest.spyOn(console, "warn");
  });

  beforeEach(() => {
    jest.resetAllMocks();
    mockStore = createMockStore();
  });

  describe("Работа со стором напрямую", () => {
    let savedStoreValueRef: MutableRefObject<MockStoreValue>;
    const EmptyComponent: ComponentType = () => null;
    const RootComponent = (props: ComponentProps<typeof mockStore.StoreValueProvider>) => {
      const storeValueRef = useRef<MockStoreValue>();

      savedStoreValueRef = storeValueRef;

      return (
        <mockStore.StoreValueProvider {...props} storeValueRef={storeValueRef}>
          <EmptyComponent />
        </mockStore.StoreValueProvider>
      );
    };

    it("Должен создаться стор со значениями по умолчанию", () => {
      act(() => {
        create(<RootComponent />);
      });

      expect(savedStoreValueRef.current.state).toEqual(InitialState);
    });

    it("Должен создаться стор с измененными начальными значениями", () => {
      act(() => {
        create(<RootComponent partialInitialState={{ loading: true }} />);
      });

      expect(savedStoreValueRef.current.state).toEqual({ ...InitialState, loading: true });
    });

    it("Должен передать factor в аргументы экшенов и умножить инкремент на данное значение", () => {
      act(() => {
        create(
          <RootComponent
            partialInitialState={{ loading: true }}
            getActionAguments={() => ({ factor: 2 })}
          />
        );
      });

      expect(savedStoreValueRef.current.isUpdateRef.current).toBe(false);
      act(() => {
        savedStoreValueRef.current.actions.incrementAction();
      });

      expect(savedStoreValueRef.current.isUpdateRef.current).toBe(true);
      expect(savedStoreValueRef.current.state.value).toEqual(InitialState.value + 2);
    });

    it("Должен работать action decrement", async () => {
      act(() => {
        create(<RootComponent />);
      });

      expect(savedStoreValueRef.current.state.value).toBe(InitialState.value);
      act(() => savedStoreValueRef.current.actions.decrementAction());
      expect(savedStoreValueRef.current.state.value).toBe(InitialState.value - 1);
    });

    it("Должен работать асинхронный action, проверка всех полей", async () => {
      const newValue = fakerStatic.datatype.number(10);
      let resolvePromise: Handler;
      const promise = new Promise((resolve) => (resolvePromise = resolve)) as Promise<number>;

      act(() => {
        create(<RootComponent partialInitialState={{ promise }} />);
      });

      expect(savedStoreValueRef.current.state).toEqual({ ...InitialState, promise });
      const loadActionPromise = act(() => savedStoreValueRef.current.actions.loadAction());
      expect(savedStoreValueRef.current.state.value).toBe(InitialState.value);
      expect(savedStoreValueRef.current.state.loading).toBe(true);
      resolvePromise(newValue);
      await loadActionPromise;
      expect(savedStoreValueRef.current.state.value).toBe(newValue);
      expect(savedStoreValueRef.current.state.loading).toBe(false);
    });

    it("Должен отключиться стор при unmount", async () => {
      let testRenderer: ReactTestRenderer;
      act(() => {
        testRenderer = create(<RootComponent />);
      });

      act(() => {
        testRenderer.unmount();
      });

      savedStoreValueRef.current.actions.decrementAction();

      expect(savedStoreValueRef.current.isMountRef.current).toBe(false);
      expect(savedStoreValueRef.current.isUpdateRef.current).toBe(false);
      expect(savedStoreValueRef.current.state.value).toBe(InitialState.value);
      expect(consoleWarnMock).toHaveBeenCalledTimes(1);
      expect(savedStoreValueRef.current.state.value).toBe(InitialState.value);
    });

    it("Должен отключиться и сброситься стор при unmount", () => {
      let testRenderer: ReactTestRenderer;
      act(() => {
        testRenderer = create(<RootComponent />);
      });

      expect(savedStoreValueRef.current.state.value).toBe(InitialState.value);
      act(() => savedStoreValueRef.current.actions.decrementAction());
      expect(savedStoreValueRef.current.state.value).toBe(InitialState.value - 1);
      act(() => {
        testRenderer.unmount();
      });
      expect(savedStoreValueRef.current.isMountRef.current).toBe(false);
      expect(savedStoreValueRef.current.isUpdateRef.current).toBe(false);

      act(() => {
        testRenderer = create(<RootComponent />);
      });

      expect(savedStoreValueRef.current.state).toEqual(InitialState);
    });
  });

  describe("Работа со стором через контекст", () => {
    const RootComponent = (props: ComponentProps<typeof mockStore.StoreValueProvider>) => {
      const storeValueRef = useRef<MockStoreValue>();

      return <mockStore.StoreValueProvider {...props} storeValueRef={storeValueRef} />;
    };

    it("Должен создаться стор со значениями по умолчанию", () => {
      let state: MockStoreValue["state"];
      const ChildComponent = () => {
        state = mockStore.useMockStoreSelector((store) => store.state);

        return null as ReactElement;
      };

      act(() => {
        create(
          <RootComponent>
            <ChildComponent />
          </RootComponent>
        );
      });

      expect(state).toEqual(InitialState);
    });

    it("Должен создаться стор с измененными начальными значениями", () => {
      let state: MockStoreValue["state"];
      const newInitialStateDiff = { value: 10 };
      const ChildComponent = () => {
        state = mockStore.useMockStoreSelector((store) => store.state);

        return null as ReactElement;
      };

      act(() => {
        create(
          <RootComponent partialInitialState={newInitialStateDiff}>
            <ChildComponent />
          </RootComponent>
        );
      });

      expect(state).toEqual({ ...InitialState, ...newInitialStateDiff });
    });

    it("Не должно быть ререндеров, если меняются данные стора, неиспользуемые внутри компонента", async () => {
      const mockFn = jest.fn();
      const ChildComponent = () => {
        const loading = mockStore.useMockStoreSelector((store) => store.state.loading);
        const { decrementAction } = mockStore.useMockStoreSelector((store) => store.actions);
        mockFn();

        useEffect(() => {
          decrementAction();
        }, [decrementAction]);

        return <div>{loading}</div>;
      };

      act(() => {
        create(
          <RootComponent>
            <ChildComponent />
          </RootComponent>
        );
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("Должен работать action increment", () => {
      const mockFn = jest.fn();
      let incrementActionFn: Handler;

      const ChildComponent = () => {
        const value = mockStore.useMockStoreSelector((store) => store.state.value);
        const { incrementAction } = mockStore.useMockStoreSelector((store) => store.actions);

        incrementActionFn = incrementAction;
        mockFn();

        return <div>{value}</div>;
      };

      act(() => {
        create(
          <RootComponent>
            <ChildComponent />
          </RootComponent>
        );
      });

      expect(mockFn).toHaveBeenCalledTimes(1);

      act(() => {
        incrementActionFn();
      });

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});

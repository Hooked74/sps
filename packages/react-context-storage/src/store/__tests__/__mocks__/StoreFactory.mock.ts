import { StoreFactory } from "../..";
import { StoreValue } from "../../../types";
enum MockStoreFactoryActionTypes {
  LOAD_START = "LOAD_START",
  LOADING = "LOADING",
  LOAD_STOP = "LOAD_STOP",
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
}

export const InitialState = {
  loading: false,
  value: 0,
  promise: Promise.resolve(0),
};

export type MockStore = ReturnType<typeof createMockStore>;

export type MockStoreValue = StoreValue<MockStore>;

export type MockStoreFactoryActionMap = {
  [MockStoreFactoryActionTypes.LOADING]: int;
  [MockStoreFactoryActionTypes.INCREMENT]: { factor: int };
};

export type MockStoreFactoryActionArguments = { factor?: int };

export const createMockStore = () =>
  new StoreFactory<
    typeof MockStoreFactoryActionTypes,
    MockStoreFactoryActionMap,
    MockStoreFactoryActionArguments
  >("TestingStorePage").createStore(
    InitialState,
    (state, action) => {
      switch (action.type) {
        case MockStoreFactoryActionTypes.LOAD_START:
          state.loading = true;
          return state;
        case MockStoreFactoryActionTypes.LOAD_STOP:
          state.loading = false;
          return state;
        case MockStoreFactoryActionTypes.LOADING:
          state.value = action.payload;
          return state;
        case MockStoreFactoryActionTypes.INCREMENT:
          state.value = state.value + 1 * action.payload.factor;
          return state;
        case MockStoreFactoryActionTypes.DECREMENT:
          state.value = state.value - 1;
          return state;
      }
    },
    {
      async loadAction({ dispatch, initialState }) {
        dispatch({ type: MockStoreFactoryActionTypes.LOAD_START });
        dispatch({
          type: MockStoreFactoryActionTypes.LOADING,
          payload: await initialState.promise,
        });
        dispatch({ type: MockStoreFactoryActionTypes.LOAD_STOP });
      },
      incrementAction({ dispatch, factor = 1 }) {
        dispatch({ type: MockStoreFactoryActionTypes.INCREMENT, payload: { factor } });
      },
      decrementAction({ dispatch }) {
        dispatch({ type: MockStoreFactoryActionTypes.DECREMENT });
      },
    },
    {
      useStoreSelector: "useMockStoreSelector",
    } as const
  );

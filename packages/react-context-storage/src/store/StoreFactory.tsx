import {
  Reducer,
  useReducer,
  useContext,
  useSyncExternalStore,
  PropsWithChildren,
  MutableRefObject,
  Context,
  useRef,
} from "react";
import {
  StoreReducerDecorator,
  StoreEventEmitter,
  StoreAliassesCreator,
  StoreContextCreator,
} from "./";
import { useActions } from "../hooks";
import { Action, BaseActions, StoreKeys, ContextState, Selector, Dispatch } from "../types";
import { DevtoolsStoreDecorator } from "../devtools";

export class StoreFactory<StoreTypes, ActionMap = unknown, ActionArguments = unknown> {
  constructor(private readonly storeName: string) {}

  public createStore<
    StoreState,
    StoreReducer extends Reducer<StoreState, Action<StoreTypes, ActionMap>>,
    StoreActions extends BaseActions<StoreTypes, ActionMap, ActionArguments, StoreState>,
    StoreAliasKeysMap extends Partial<StoreKeys>,
    StoreEventEmitterTypes extends Dictionary<string>
  >(
    initialState: StoreState,
    reducer: StoreReducer,
    initialActions: StoreActions,
    aliasKeysMap?: StoreAliasKeysMap,
    storeEventEmitterTypes?: StoreEventEmitterTypes
  ) {
    const devtoolsStoreDecorator = new DevtoolsStoreDecorator<StoreTypes, ActionMap>(
      this.storeName
    );
    let { StoreContext, StoreProvider } = new StoreContextCreator<
      StoreTypes,
      ActionMap,
      ActionArguments,
      StoreState,
      StoreActions,
      StoreEventEmitterTypes
    >(initialState).create();
    StoreProvider = devtoolsStoreDecorator.decorateStoreProvider(StoreProvider);

    const { useStoreSelector, useStoreValue } = this.createHooks(
      StoreContext,
      initialState,
      devtoolsStoreDecorator.decorateStoreReducer<StoreTypes, ActionMap, StoreState, StoreReducer>(
        new StoreReducerDecorator<StoreTypes, ActionMap, StoreState, StoreReducer>(
          this.storeName,
          reducer
        ).decorate()
      ),
      initialActions,
      new StoreEventEmitter(storeEventEmitterTypes)
    );

    type StoreValueProviderProps = PropsWithChildren<{
      storeValueRef?: MutableRefObject<ReturnType<typeof useStoreValue>>;
      partialInitialState?: Partial<StoreState>;
      getActionAguments?: (initialState: StoreState) => ActionArguments;
    }>;

    return new StoreAliassesCreator(
      {
        storeName: this.storeName,
        StoreProvider,
        useStoreSelector,
        useStoreValue,
        StoreContext,
        StoreValueProvider: ({
          children,
          storeValueRef,
          partialInitialState,
          getActionAguments,
        }: StoreValueProviderProps) => {
          const storeValue = useStoreValue(
            partialInitialState
              ? {
                  ...initialState,
                  ...partialInitialState,
                }
              : undefined,
            getActionAguments
          );

          const mutableStoreValueRef = useRef(storeValue);
          Object.assign(mutableStoreValueRef.current, storeValue);

          if (storeValueRef) storeValueRef.current = storeValue;

          return <StoreProvider value={mutableStoreValueRef.current}>{children}</StoreProvider>;
        },
      },
      aliasKeysMap
    ).create();
  }

  private createHooks<
    StoreContext extends Context<any>,
    StoreState,
    StoreReducer extends Reducer<StoreState, Action<StoreTypes, ActionMap>>,
    StoreActions extends BaseActions<StoreTypes, ActionMap, ActionArguments, StoreState>,
    StoreEventEmitterTypes extends Dictionary<string>
  >(
    StoreContext: StoreContext,
    initialState: StoreState,
    reducer: StoreReducer,
    initialActions: StoreActions,
    eventEmitter: StoreEventEmitter<StoreEventEmitterTypes>
  ) {
    type StoreContextState = ContextState<StoreContext>;
    type UseReducer = (
      reducer: StoreReducer,
      state: StoreState
    ) => [StoreState, Dispatch<StoreTypes, ActionMap>];

    const useStoreSelector = <StoreSelectorReturnValue extends any>(
      selector: Selector<StoreContextState, StoreSelectorReturnValue>
    ) => {
      const storeValue = useContext(StoreContext);
      const getSnapshot = () => selector(storeValue);
      return useSyncExternalStore(
        eventEmitter.unsafe_subscribeOnStateUpdate,
        getSnapshot,
        getSnapshot
      );
    };

    const { useLifecycleComponentEvents, useStateUpdate } = eventEmitter.unsafe_createHooks();
    const useStoreValue = (
      _initialState: StoreState = initialState,
      getActionAguments: (initialState: StoreState) => ActionArguments = () => void 0
    ) => {
      const __initialState = { ..._initialState };
      const [state, dispatch] = (useReducer as UseReducer)(reducer, __initialState);
      const actions = useActions(initialActions, {
        initialState: __initialState,
        dispatch,
        ...getActionAguments(__initialState),
      });
      const { isMountRef, isUpdateRef } = useLifecycleComponentEvents();

      useStateUpdate(state);

      return { state, actions, dispatch, eventEmitter, isMountRef, isUpdateRef };
    };

    return { useStoreSelector, useStoreValue };
  }
}

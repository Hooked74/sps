import { Dispatch as ReactDispatch, MutableRefObject, Context } from "react";
import { StoreEventEmitter } from "./store";

export type ActionStruct<ActionType, ActionPayload = any> = {
  type: ActionType;
  payload?: ActionPayload;
};

export type ActionEnum<ActionMap> = ValueOf<{
  [ActionType in keyof ActionMap]: ActionStruct<ActionType, ActionMap[ActionType]>;
}>;

export type Action<StoreTypes, ActionMap> = ActionEnum<
  EnumToProps<StoreTypes, undefined, ActionMap>
>;

export type Selector<T, U> = (value: T) => U;

export type Dispatch<StoreTypes, ActionMap> = ReactDispatch<Action<StoreTypes, ActionMap>>;

export type BaseActions<StoreTypes, ActionMap, ActionArguments, StoreState> = Dictionary<
  (
    actionArgs: {
      initialState: StoreState;
      dispatch: Dispatch<StoreTypes, ActionMap>;
    } & ActionArguments,
    ...args: any[]
  ) => any
>;

export interface AbstractStore {
  storeName: string;
  StoreContext: any;
  StoreProvider: any;
  useStoreSelector: any;
  useStoreValue: any;
  StoreValueProvider: any;
}

export type StoreKeys = { [P in keyof AbstractStore]: string };

export type ContextState<T extends Context<any>> = T extends Context<infer State> ? State : never;

export type StoreValue<T extends { useStoreValue: Handler }> = ReturnType<T["useStoreValue"]>;

export interface StoreContextState<
  StoreTypes,
  ActionMap,
  StoreState,
  StoreActions extends Dictionary<Handler>,
  StoreEventEmitterEvents extends Dictionary<string>
> {
  state: StoreState;
  actions: SkipFirstArgumentForDictionary<StoreActions>;
  dispatch: Dispatch<StoreTypes, ActionMap>;
  eventEmitter: StoreEventEmitter<StoreEventEmitterEvents>;
  isMountRef: MutableRefObject<boolean>;
  isUpdateRef: MutableRefObject<boolean>;
}

export type DevtoolsMessageListener<ActionType> = (
  e: MessageEvent<ActionStruct<ActionType>>
) => void;

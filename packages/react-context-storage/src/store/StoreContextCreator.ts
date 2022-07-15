import { createContext } from "react";
import { StoreContextState, BaseActions } from "../types";

export class StoreContextCreator<
  StoreTypes,
  ActionMap,
  ActionArguments,
  StoreState,
  StoreActions extends BaseActions<StoreTypes, ActionMap, ActionArguments, StoreState>,
  StoreEventEmitterEvents extends Dictionary<string>
> {
  constructor(private readonly initialState: StoreState) {}

  public create() {
    const StoreContext = createContext<
      StoreContextState<StoreTypes, ActionMap, StoreState, StoreActions, StoreEventEmitterEvents>
    >({
      state: this.initialState,
      actions: {},
      dispatch: () => {},
      eventEmitter: null,
      isMountRef: { current: false },
      isUpdateRef: { current: false },
    });

    const StoreProvider = StoreContext.Provider;

    return { StoreContext, StoreProvider };
  }
}

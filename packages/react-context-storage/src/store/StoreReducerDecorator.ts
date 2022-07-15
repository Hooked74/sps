import { Reducer } from "react";
import { Action } from "../types";
import immer from "immer";

export class StoreReducerDecorator<
  StoreTypes,
  ActionMap,
  StoreState,
  StoreReducer extends Reducer<StoreState, Action<StoreTypes, ActionMap>>
> {
  constructor(private readonly storeName: string, private reducer: StoreReducer) {}

  private addImmutableStateForReducer() {
    const reducer = this.reducer;
    this.reducer = ((prevStoreState: StoreState, action: Action<StoreTypes, ActionMap>) =>
      immer(prevStoreState, (draft: StoreState) => reducer(draft, action))) as StoreReducer;
  }

  private addCheckIfReducerResultIsEmpty() {
    const reducer = this.reducer;
    this.reducer = ((prevStoreState: StoreState, action: Action<StoreTypes, ActionMap>) => {
      const storeState = reducer(prevStoreState, action);
      if (storeState) return storeState;

      throw new Error(`Unknown action type ${String(action.type)} in ${this.storeName}`);
    }) as StoreReducer;
  }

  public decorate() {
    this.addCheckIfReducerResultIsEmpty();
    this.addImmutableStateForReducer();

    return this.reducer;
  }
}

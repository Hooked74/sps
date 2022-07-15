import { useAdvancedEffect } from "@h74-sps/utils";
import { ComponentProps, ComponentType, memo, Reducer } from "react";
import { DevtoolsEmitter } from "./DevtoolsEmitter";
import { Action, Dispatch } from "../types";
import { DevtoolsManager, DevtoolsState } from ".";

export class DevtoolsStoreDecorator<StoreTypes, ActionMap = unknown> {
  private emitter: DevtoolsEmitter = new DevtoolsEmitter();

  private storeDispatch: Dispatch<StoreTypes, ActionMap>;

  constructor(private readonly storeName: string) {
    DevtoolsManager.subscribeOnDevtoolsStateChange((devtoolsState) => {
      this.emitter.setDevtoolsState(devtoolsState);
      this.emitter.flushEventStack();

      if (devtoolsState === DevtoolsState.disabled) {
        this.emitter.unsafe_emit(this.emitter.types.STORE_DESTROY, { storeName });
      }
    });

    this.emitter.emit(this.emitter.types.STORE_INIT, { storeName });
    this.emitter.subscribeOnMessage((e) => {
      if (e.data.type === this.emitter.types.STORE_EVENT_STACK_FLUSH) {
        this.emitter.flushEventStack();
      } else if (e.data.type === this.emitter.types.STORE_DISPATCH) {
        this.storeDispatch?.(e.data.payload);
      }
    });
  }

  public decorateStoreProvider<StoreProviderComponent extends ComponentType<any>>(
    StoreProvider: StoreProviderComponent
  ) {
    return memo((props: ComponentProps<StoreProviderComponent>) => {
      this.storeDispatch = props.value.dispatch;

      useAdvancedEffect(() => {
        this.emitter.emit(this.emitter.types.STORE_MOUNT, {
          storeName: this.storeName,
          storeState: props.value.state,
        });

        return () => {
          this.emitter.emit(this.emitter.types.STORE_UNMOUNT, {
            storeName: this.storeName,
          });
        };
      }, []);

      return <StoreProvider {...props} />;
    });
  }

  public decorateStoreReducer<
    StoreTypes,
    ActionMap,
    StoreState,
    StoreReducer extends Reducer<StoreState, Action<StoreTypes, ActionMap>>
  >(reducer: StoreReducer) {
    return ((prevStoreState: StoreState, action: Action<StoreTypes, ActionMap>) => {
      const storeState = reducer(prevStoreState, action);

      this.emitter.emit(this.emitter.types.STORE_STATE_UPDATE, {
        storeName: this.storeName,
        prevStoreState,
        storeState,
        action,
      });

      return storeState;
    }) as StoreReducer;
  }
}

import { useAdvancedEffect } from "@h74-sps/utils";
import { EventEmitter } from "events";
import { useEffect } from "react";
import { STORE_EFFECT_HOOK_KEY } from "../constants";

export class StoreEventEmitter<
  StoreEventEmitterTypes extends Dictionary<string>
> extends EventEmitter {
  public types = {
    ...({} as StoreEventEmitterTypes),
    COMPONENT_MOUNT: "component:mount",
    COMPONENT_UPDATE: "component:update",
    COMPONENT_EFFECT: "component:effect",
    COMPONENT_UNMOUNT: "component:unmount",
    STATE_UPDATE: "state:update",
  } as const;

  constructor(customTypes: StoreEventEmitterTypes = {} as StoreEventEmitterTypes) {
    super();
    Object.assign(this.types, customTypes);
  }

  public unsafe_createHooks() {
    const useLifecycleComponentEvents = () =>
      useAdvancedEffect(
        (isUpdate) => {
          if (isUpdate) {
            this.emit(this.types.COMPONENT_UPDATE);
          } else {
            this.emit(this.types.COMPONENT_MOUNT);
          }

          this.emit(this.types.COMPONENT_EFFECT);
        },
        undefined,
        {
          unmountCallback: () => this.emit(this.types.COMPONENT_UNMOUNT),
          hookKey: STORE_EFFECT_HOOK_KEY,
        }
      );

    const useStateUpdate = <State>(state: State) => {
      useAdvancedEffect(() => this.emit(this.types.STATE_UPDATE), [state], {
        didUpdate: true,
        hookKey: STORE_EFFECT_HOOK_KEY,
      });
      useEffect(
        () => () => {
          this.removeAllListeners(this.types.STATE_UPDATE);
        },
        []
      );
    };

    return { useLifecycleComponentEvents, useStateUpdate };
  }

  public unsafe_subscribeOnStateUpdate = <Listener extends Handler>(listener: Listener) => {
    this.on(this.types.STATE_UPDATE, listener);

    return () => {
      this.off(this.types.STATE_UPDATE, listener);
    };
  };
}

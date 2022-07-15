import { DevtoolsManager, DevtoolsState } from ".";
import { DevtoolsMessageListener } from "../types";
import { GlobalManager } from "@h74-sps/utils";

type DevtoolsEmitterTypes = ValueOf<DevtoolsEmitter["types"]>;

export class DevtoolsEmitter {
  public types = {
    STORE_INIT: "react-context-storage:devtools:store:init",
    STORE_MOUNT: "react-context-storage:devtools:store:mount",
    STORE_UNMOUNT: "react-context-storage:devtools:store:unmount",
    STORE_STATE_UPDATE: "react-context-storage:devtools:store:state:update",
    STORE_DISPATCH: "react-context-storage:devtools:store:dispatch",
    STORE_DESTROY: "react-context-storage:devtools:store:destroy",
    STORE_EVENT_STACK_FLUSH: "react-context-storage:devtools:event-stack:flush",
  } as const;

  private devtoolsState: DevtoolsState = DevtoolsManager.devtoolsState;
  private eventStack: Array<[DevtoolsEmitterTypes, any]> = [];

  public setDevtoolsState(devtoolsState: DevtoolsState) {
    this.devtoolsState = devtoolsState;
  }

  public flushEventStack() {
    if (this.devtoolsState === DevtoolsState.enabled) {
      this.eventStack.forEach((eventArgs) => this.unsafe_emit(...eventArgs));
    }
  }

  public unsafe_emit<Payload>(type: DevtoolsEmitterTypes, payload?: Payload) {
    if (GlobalManager.isClient()) {
      DevtoolsManager.devtoolsMessagePort.postMessage({ type, payload });
    }
  }

  public emit<Payload>(type: DevtoolsEmitterTypes, payload?: Payload) {
    this.eventStack.push([type, payload]);
    if (this.devtoolsState === DevtoolsState.enabled) {
      this.unsafe_emit<Payload>(type, payload);
    }
  }

  public subscribeOnMessage(listener: DevtoolsMessageListener<DevtoolsEmitterTypes>) {
    DevtoolsManager.devtoolsMessagePort.addEventListener("message", listener);
    DevtoolsManager.devtoolsMessagePort.start();
  }

  public unsubscribeOnMessage(listener: DevtoolsMessageListener<DevtoolsEmitterTypes>) {
    DevtoolsManager.devtoolsMessagePort.removeEventListener("message", listener);
  }
}

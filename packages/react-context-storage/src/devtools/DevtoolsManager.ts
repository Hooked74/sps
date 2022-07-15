import { EventEmitter } from "events";
import { ActionStruct } from "../types";
import { DevtoolsState } from "./DevtoolsState";
import { GlobalManager } from "@h74-sps/utils";

class _DevtoolsManager extends EventEmitter {
  private types = {
    DEVTOOLS_STATE_CHANGE: "devtools:state:change",
  } as const;

  private _devtoolsState = DevtoolsState.disabled;

  public readonly devtoolsMessageChannel = new MessageChannel();
  private devtoolsSyncTypes = {
    INIT: "react-context-storage:devtools:init",
    PORT_SYNC: "react-context-storage:devtools:port:sync",
  } as const;

  constructor() {
    super();
    this.setMaxListeners(0);
    this.syncDevtoolsMessageChannel();
  }

  get devtoolsMessagePort() {
    return this.devtoolsMessageChannel.port1;
  }

  get devtoolsState() {
    return this._devtoolsState;
  }

  private syncDevtoolsMessageChannel() {
    if (GlobalManager.isClient()) {
      const listener = (e: MessageEvent<ActionStruct<ValueOf<typeof this.devtoolsSyncTypes>>>) => {
        if (e.data?.type === this.devtoolsSyncTypes.INIT) {
          GlobalManager.get("postMessage")(
            {
              type: this.devtoolsSyncTypes.PORT_SYNC,
            },
            "*",
            [this.devtoolsMessageChannel.port2]
          );
          GlobalManager.get("removeEventListener")("message", listener);
        }
      };

      GlobalManager.get("addEventListener")("message", listener);
    }
  }

  public enableDevtools() {
    if (this._devtoolsState !== DevtoolsState.enabled) {
      this._devtoolsState = DevtoolsState.enabled;
      this.emit(this.types.DEVTOOLS_STATE_CHANGE, this._devtoolsState);
    }
  }

  public disableDevtools() {
    if (this._devtoolsState !== DevtoolsState.disabled) {
      this._devtoolsState = DevtoolsState.disabled;
      this.emit(this.types.DEVTOOLS_STATE_CHANGE, this._devtoolsState);
    }
  }

  public subscribeOnDevtoolsStateChange(
    callback: (devtoolsState: DevtoolsState) => void,
    isInstantCallback = true
  ) {
    if (isInstantCallback) callback(this._devtoolsState);
    this.on(this.types.DEVTOOLS_STATE_CHANGE, callback);
  }

  public unsubscribeOnDevtoolsStateChange(callback: Handler<void>) {
    this.off(this.types.DEVTOOLS_STATE_CHANGE, callback);
  }
}

export const DevtoolsManager = new _DevtoolsManager();

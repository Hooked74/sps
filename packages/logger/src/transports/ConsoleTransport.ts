/* eslint-disable no-console */
import TransportStream from "winston-transport";
import { GlobalManager } from "@h74-sps/utils";
import { MESSAGE, LEVEL } from "triple-beam";

export class ConsoleTransport extends TransportStream {
  constructor(options: TransportStream.TransportStreamOptions = {}) {
    super(options);
    this.setMaxListeners(0);
  }

  public log<Entry extends Dictionary<any>>(entry: Entry, next: Handler) {
    const timeout = GlobalManager.has("setImmediate")
      ? GlobalManager.get("setImmediate")
      : GlobalManager.get("setTimeout");
    timeout(() => this.emit("logged", entry));

    (console[entry[LEVEL] as KeyOfType<Console, Handler>] ?? console.log).call(
      console,
      entry[MESSAGE]
    );

    next?.();
  }
}

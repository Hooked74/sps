/* eslint-disable no-console */
import { GlobalManager } from "@h74-sps/utils";
import TransportStream from "winston-transport";

export class MockTransport extends TransportStream {
  public static message = fakerStatic.random.word();

  constructor(options: TransportStream.TransportStreamOptions = {}) {
    super(options);
    this.setMaxListeners(0);
  }

  public log<Entry extends Dictionary<any>>(entry: Entry, next: Handler) {
    const timeout = GlobalManager.has("setImmediate")
      ? GlobalManager.get("setImmediate")
      : GlobalManager.get("setTimeout");
    timeout(() => this.emit("logged", entry));

    console.log(MockTransport.message);

    next?.();
  }
}

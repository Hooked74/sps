type GlobalThis = typeof globalThis;

class _GlobalManager {
  get globalThis() {
    if (typeof globalThis !== "undefined") {
      return globalThis;
    }

    return this.isClient() ? window : global;
  }

  public isClient() {
    return typeof window !== "undefined";
  }

  public isServer() {
    return !this.isClient();
  }

  public has(key: string) {
    return Boolean((this.globalThis as any)[key]);
  }

  public get<Key extends keyof GlobalThis>(key: Key): GlobalThis[Key];
  public get<Value>(key: string): Value;
  public get<Value>(key: string) {
    return (this.globalThis as any)[key] as Value;
  }

  public set<Value>(key: string, value: Value) {
    (this.globalThis as any)[key] = value;
  }
}

export const GlobalManager = new _GlobalManager();

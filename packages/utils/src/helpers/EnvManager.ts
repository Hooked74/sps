class _EnvManager {
  private readonly parsedEnvMap = new Map();

  get env() {
    return typeof process !== "undefined" ? process.env : import.meta.env;
  }

  private parse<Value>(value: Value) {
    try {
      return JSON.parse(value as any) as Value;
    } catch {
      return value;
    }
  }

  public get<Key extends keyof NodeJS.CustomProcessEnv>(
    key: Key,
    defaultValue?: NodeJS.CustomProcessEnv[Key]
  ): NodeJS.CustomProcessEnv[Key] {
    if (!this.parsedEnvMap.has(key)) {
      this.parsedEnvMap.set(key, this.parse(this.env[key]) ?? defaultValue);
    }

    return this.parsedEnvMap.get(key);
  }

  public compare<Key extends keyof NodeJS.CustomProcessEnv>(
    key: Key,
    value: NodeJS.CustomProcessEnv[Key]
  ) {
    return this.get(key) === value;
  }
}

export const EnvManager = new _EnvManager();

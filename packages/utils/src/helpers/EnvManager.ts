class _EnvManager {
  private readonly parsedEnvMap = new Map();

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
      this.parsedEnvMap.set(
        key,
        this.parse(
          typeof process !== "undefined" && typeof process.env[key] !== "undefined"
            ? process.env[key]
            : import.meta.env[key]
        ) ?? defaultValue
      );
    }

    return this.parsedEnvMap.get(key);
  }

  public compare<Key extends keyof NodeJS.CustomProcessEnv>(
    key: Key,
    value: NodeJS.CustomProcessEnv[Key]
  ) {
    return this.get(key) === value;
  }

  public clearCache() {
    this.parsedEnvMap.clear();
  }
}

export const EnvManager = new _EnvManager();

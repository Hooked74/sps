import { AbstractStore } from "../types";

export class StoreAliassesCreator<
  Store extends AbstractStore,
  StoreAliasKeysMap extends Dictionary<string>
> {
  constructor(private readonly store: Store, private readonly aliasKeysMap: StoreAliasKeysMap) {}

  public create() {
    type AliasKeys = Extract<keyof StoreAliasKeysMap, keyof Store>;
    type NestedAliases = { [P in AliasKeys]: { [K in StoreAliasKeysMap[P]]: Store[P] } };
    type UnionAliases = NestedAliases[keyof NestedAliases];
    type StoreWithAliases = Store & UnionToIntersection<UnionAliases>;

    return {
      ...this.store,
      ...Object.keys(this.aliasKeysMap ?? {}).reduce((acc: any, key) => {
        if (key in this.store) {
          const aliasKeysMap = this.aliasKeysMap;
          acc[this.aliasKeysMap[key as keyof typeof aliasKeysMap]] = (this.store as any)[key];
        }

        return acc;
      }, {}),
    } as StoreWithAliases;
  }
}

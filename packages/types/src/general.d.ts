/**
 * *Primitive*
 */
declare type int = number;
declare type uint = number;
declare type float = number;
declare type ufloat = number;

/**
 * *Constructor*
 */
declare type Constructor<T> = new (...args: any[]) => T;
declare type SafeConstructor<T extends object> = T extends object
  ? new (...args: any[]) => T
  : never;
declare type Decorator<T, U extends T> = (Component: Constructor<T>) => Constructor<U>;
declare type SafeDecorator<T extends object, U extends T> = (
  Component: SafeConstructor<T>
) => SafeConstructor<U>;
declare type ConstructorType<T> = T extends new (...args: any[]) => infer P ? P : never;

/**
 * *Collection*
 */
declare interface Dictionary<T> {
  [key: string]: T;
}
declare interface Tuple<T> {
  [key: number]: T;
}
declare interface ReadonlyDictionary<T> {
  readonly [key: string]: T;
}
declare type SkipFirstArrayElement<Array extends any[]> = Array extends [FirstElement, ...infer P]
  ? P
  : never;

/**
 * *Brand*
 */
declare type Brand<K, T> = K & { __brand: T };
declare type StringBrand<T, B extends string> = T & { readonly __brand: B };
declare interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol; // ensures uniqueness across modules / packages
}
declare type NonEmptyString = string & NonEmptyStringBrand;

/**
 * *Function*
 */
declare type Handler<T = any> = (...args: any[]) => T;
declare type SkipFirstArgument<Function extends Handler> = Function extends (
  firstArgument: any,
  ...args: infer Arguments
) => infer Response
  ? (...args: Arguments) => Response
  : never;
declare type SkipFirstArgumentForDictionary<T extends Dictionary<Handler>> = {
  [P in keyof T]?: SkipFirstArgument<T[P]>;
};

/**
 * *Promise*
 */
declare type PromiseResolve = (value?: void | PromiseLike<void> | undefined) => void;
declare type PromiseReject = (reason?: any) => void;

/**
 * *Field Access*
 */
declare type Writable<T> = { -readonly [K in keyof T]: T[K] };
declare type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
declare type ReadonlyPartial<T> = { readonly [P in keyof T]?: T[P] };
declare type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * *Transform*
 */
declare type EnumToProps<T, U, O = {}> = {
  [P in keyof T]: keyof O[P] extends never ? U : O[P];
};
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/**
 * *Pick*
 */
declare type KeyOfType<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T];
declare type KeysOfUnion<T> = T extends any ? keyof T : never;
declare type PickField<T, K extends keyof T> = T[K];
declare type PickKeys<T> = keyof T;
declare type ArrayItem<T> = T extends (infer P)[] ? P : never;
declare type ValueOf<T> = T[keyof T];
declare type PickValuesByType<FromType, KeepType = any, Include = true> = {
  [K in keyof FromType]: FromType[K] extends KeepType
    ? Include extends true
      ? K
      : never
    : Include extends true
    ? never
    : K;
}[keyof FromType];
declare type Entries<T> = ValueOf<{ [P in keyof T]: [P, T[P]] }>[];

/**
 * *Modules*
 */
declare module "*.svg" {
  export const ReactSvgComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;

  export default src;
}

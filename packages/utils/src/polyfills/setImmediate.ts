import { GlobalManager } from "../helpers/GlobalManager";

export const attachSetImmediatePolyfill = () => {
  if (!GlobalManager.has("setImmediate")) {
    type SetImmediate<Arguments extends any[] = any[]> = typeof setImmediate<Arguments>;
    type SetImmediateCallbackParameter<Arguments extends any[] = any[]> = Parameters<
      SetImmediate<Arguments>
    >[0];
    type SetImmediateCallbackArguments<Arguments extends any[] = any[]> = Parameters<
      SkipFirstArgument<SetImmediate<Arguments>>
    >;

    let uniqImmediateId = 0;
    const immediateMap = new Map<
      NodeJS.Immediate,
      [SetImmediateCallbackParameter, SetImmediateCallbackArguments]
    >();
    const runImmediate = (id: NodeJS.Immediate) => {
      if (immediateMap.has(id)) {
        const [callback, args] = immediateMap.get(id);
        Reflect.apply(callback, undefined, args);
        clearImmediate(id);
      }
    };

    const channel = new MessageChannel();
    const registerImmediate = (id: NodeJS.Immediate) => channel.port2.postMessage(id);

    channel.port1.onmessage = (event) => runImmediate(event.data);

    function _setImmediate<Arguments extends any[]>(
      callback: SetImmediateCallbackParameter<Arguments>,
      ...args: SetImmediateCallbackArguments<Arguments>
    ) {
      const immediateId = uniqImmediateId++ as int & NodeJS.Immediate;

      immediateMap.set(immediateId, [callback as SetImmediateCallbackParameter, args]);
      registerImmediate(immediateId);

      return immediateId;
    }

    _setImmediate.__promisify__ = <T = void>() =>
      new Promise<T>((resolve) => _setImmediate(resolve as any));

    function _clearImmediate(id: NodeJS.Immediate) {
      immediateMap.delete(id);
    }

    GlobalManager.set("setImmediate", _setImmediate);
    GlobalManager.set("clearImmediate", _clearImmediate);
  }
};

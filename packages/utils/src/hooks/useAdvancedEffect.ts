import React, { useRef } from "react";
import { DefaultAdvancedEffectOptions } from "../constants";
import { AdvancedEffectHookOptions } from "../types";

export const useAdvancedEffect = <Conditions extends Array<any>>(
  callback?: (isUpdate: boolean) => void,
  conditions?: Conditions,
  options?: AdvancedEffectHookOptions
) => {
  options = {
    ...DefaultAdvancedEffectOptions,
    ...options,
  };

  const isMountRef = useRef(false);
  const isUpdateRef = useRef(false);
  const isOnceCall = useRef(false);
  const hook = React[options.hookKey];

  hook(() => {
    if (isMountRef.current) isUpdateRef.current = true;
  }, conditions);

  hook(() => {
    isMountRef.current = true;
  }, []);

  hook(() => {
    if (
      (!options.didUpdate || isUpdateRef.current) &&
      (!options.once || (options.once && !isOnceCall.current))
    ) {
      callback?.(isUpdateRef.current);
      isOnceCall.current = true;
    }

    return () => {
      options.unmountCallback?.();
    };
  }, conditions);

  hook(() => {
    return () => {
      isMountRef.current = false;
      isUpdateRef.current = false;
      isOnceCall.current = false;
    };
  }, []);

  return { isMountRef, isUpdateRef, isOnceCall };
};

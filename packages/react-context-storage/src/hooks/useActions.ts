import { useMemo } from "react";
import { useAdvancedEffect, useCallbackBuffer } from "@h74-sps/utils";
import { Action, Dispatch } from "../types";
import { reactContextStorageLogger } from "../utils";
import { STORE_EFFECT_HOOK_KEY } from "../constants";

export const useActions = <
  Actions extends Dictionary<Handler>,
  WrappedActions extends SkipFirstArgumentForDictionary<Actions>,
  Args extends { dispatch: Dispatch<any, any> } & Parameters<Actions[keyof Actions]>[0]
>(
  actions: Actions,
  args: Args
) => {
  const callbackBuffer = useCallbackBuffer();
  const { isMountRef } = useAdvancedEffect(() => callbackBuffer.flush(), [], {
    hookKey: STORE_EFFECT_HOOK_KEY,
  });

  const dispatch = args.dispatch;

  args.dispatch = <ActionType, ActionMap = unknown>(action: Action<ActionType, ActionMap>) => {
    if (isMountRef.current) {
      dispatch(action);
    } else {
      throw new Error("Unable to dispatch because the component is not mountable");
    }
  };

  return useMemo(() => {
    const wrappedActions = {} as WrappedActions;

    for (const [key, action] of Object.entries(actions)) {
      (wrappedActions as any)[key] = <ActionArgs extends any[]>(...actionArgs: ActionArgs) => {
        if (isMountRef.current) {
          return action.call(actions, args, ...actionArgs);
        } else {
          callbackBuffer.push(action.bind(actions), args, ...actionArgs);
          reactContextStorageLogger.warn(
            `Unable to action "${key}" because the component is not mountable`
          );
        }
      };
    }

    return wrappedActions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

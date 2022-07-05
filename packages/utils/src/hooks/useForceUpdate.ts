import { useCallback, useState } from "react";

export const useForceUpdate = () => {
  const [, updateState] = useState<object>();
  return useCallback(() => updateState({}), []);
};

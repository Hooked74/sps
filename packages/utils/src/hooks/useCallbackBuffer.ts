import { useMemo, useRef } from "react";

export const useCallbackBuffer = () => {
  const bufferRef = useRef<[Handler, ...Array<any>][]>([]);

  return useMemo(() => {
    return {
      flush() {
        for (let bufferItem of bufferRef.current) {
          bufferItem[0](...bufferItem[1]);
        }
        bufferRef.current = [];
      },
      push<Callback extends Handler, Args extends any[]>(callback: Callback, ...args: Args) {
        bufferRef.current.push([callback, args]);
      },
    };
  }, []);
};

import { ComponentType, PropsWithChildren } from "react";

export interface ConditionalProps<Component extends ComponentType<any>>
  extends PropsWithChildren<{}> {
  condition: boolean;
  Component: Component;
}

import { ComponentProps, ComponentType } from "react";
import { ConditionalProps } from "./Conditional.types";

export const Conditional = <Component extends ComponentType<any>>({
  condition,
  Component,
  children,
  ...props
}: ConditionalProps<Component> & ComponentProps<Component>) =>
  condition ? (
    <Component {...(props as ComponentProps<Component>)}>{children}</Component>
  ) : (
    <>{children}</>
  );

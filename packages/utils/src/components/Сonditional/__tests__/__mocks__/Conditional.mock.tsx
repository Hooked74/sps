import { PropsWithChildren } from "react";

interface MockComponentProps extends PropsWithChildren<{}> {
  text: string;
}

export const MockComponent = ({ text, children }: MockComponentProps) => {
  return (
    <div>
      <span>{text}</span>
      <span>{children}</span>
    </div>
  );
};

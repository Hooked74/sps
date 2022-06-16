/// <reference types="./types/test" />
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import React, { MutableRefObject, FunctionComponent, ReactElement, createElement } from "react";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import { MessageChannel } from "worker_threads";
import { create, ReactTestRenderer, act } from "react-test-renderer";
import { act as actTestingLibrary } from "@testing-library/react";
import { TextEncoder, TextDecoder } from "util";
import "reflect-metadata";

global.React = React;
global.act = act;
global.actTestingLibrary = actTestingLibrary;
global.fakerStatic = faker;
global.userEvent = userEvent;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.MessageChannel = MessageChannel as any;
global.renderHook = <Callback extends Handler, Props>(
  callback: Callback,
  {
    props,
    isInstantRender = true,
    getWrapperElement = (TestHookElement: ReactElement) => TestHookElement,
  }: RenderHookOptions<Props> = {}
) => {
  let container: ReactTestRenderer;
  let result: MutableRefObject<ReturnType<Callback>> = { current: null };
  const TestHookComponent: FunctionComponent = (props) => {
    result.current = callback(props);
    return null;
  };

  const renderHookResult = {
    result,
    render<Props>(props?: Props) {
      act(() => {
        container = create(getWrapperElement(createElement(TestHookComponent, props)));
      });
    },
    rerender<Props>(props?: Props) {
      act(() => {
        container.update(getWrapperElement(createElement(TestHookComponent, props)));
      });
    },
    unmount() {
      act(() => {
        container.unmount();
      });
    },
  };

  if (isInstantRender) renderHookResult.render(props);

  return renderHookResult;
};

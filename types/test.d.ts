/// <reference types="@testing-library/jest-dom" />
/// <reference types="@testing-library/user-event" />

declare interface RenderHookResult<Callback extends Handler> {
  result: import("react").MutableRefObject<ReturnType<Callback>>;
  render<Props>(props: Props): void;
  rerender<Props>(props?: Props): void;
  unmount(): void;
}

declare interface RenderHookOptions<Props> {
  props?: Props;
  isInstantRender?: boolean;
  getWrapperElement?: (TestHookElement: ReactElement) => ReactElement;
}

declare type RenderHookFunction<
  RenderHookCallback extends Handler = Handler,
  RenderHookProps = any
> = <Callback extends RenderHookCallback, Props extends RenderHookProps>(
  callback: Callback,
  options?: RenderHookOptions<Props>
) => RenderHookResult<Callback>;

declare type ActFunction<Callback extends Handler = Handler> = <Callback extends ActCallback>(
  callback: Callback
) => Promise<void>;

declare var renderHook: RenderHookFunction;

declare var act: ActFunction;

declare var actTestingLibrary: ActFunction;

declare var fakerStatic: Faker.FakerStatic;

declare var userEvent: typeof import("@testing-library/user-event").default;

declare var expectJest: jest.Expect;

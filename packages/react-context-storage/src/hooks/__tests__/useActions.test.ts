import { useActions } from "../../hooks/useActions";

describe("react-context-storage/store/useActions", () => {
  const actions = {
    createMock: jest.fn(),
  };

  const actionArgs = {
    dispatch: jest.fn(),
    mock: true,
  };

  let consoleWarnMock: jest.SpyInstance;

  beforeAll(() => {
    consoleWarnMock = jest.spyOn(console, "warn");
  });

  beforeEach(() => {
    jest.resetAllMocks();
    actions.createMock.mockImplementation(({ dispatch, mock }) => dispatch(mock));
  });

  it("Должен вызвать action createMock с параметрами actionArgs", () => {
    const { result } = renderHook(() => useActions(actions, { ...actionArgs }));

    result.current.createMock(1);

    expectJest(actions.createMock).toHaveBeenCalledTimes(1);
    expectJest(actions.createMock).toHaveBeenCalledWith(
      expectJest.objectContaining({ mock: true }),
      1
    );
    expectJest(actions.createMock.mock.calls[0][0].dispatch).not.toBe(actionArgs.dispatch);
  });

  it("Должен вызвать dispatch с параметрoм actionArgs.mock", () => {
    const { result } = renderHook(() => useActions(actions, { ...actionArgs }));

    result.current.createMock();

    expectJest(actionArgs.dispatch).toHaveBeenCalledTimes(1);
    expectJest(actionArgs.dispatch).toHaveBeenCalledWith(actionArgs.mock);
  });

  it("Пока компонент не замаунтился, createMock и dispatch не должны быть вызваны, вызовется придупреждение", () => {
    renderHook(() => {
      const resultActions = useActions(actions, { ...actionArgs });

      resultActions.createMock();

      expectJest(actions.createMock).toHaveBeenCalledTimes(0);
      expectJest(actionArgs.dispatch).toHaveBeenCalledTimes(0);
      expectJest(consoleWarnMock).toHaveBeenCalledTimes(1);

      return resultActions;
    });
  });

  it("Должен вызвать отложенный createMock после рендеринга компонента (используется flush для экшенов)", () => {
    renderHook(() => {
      const resultActions = useActions(actions, { ...actionArgs });

      resultActions.createMock();

      return resultActions;
    });

    expectJest(actionArgs.dispatch).toHaveBeenCalledTimes(1);
    expectJest(actions.createMock).toHaveBeenCalledTimes(1);
  });

  it("Должен кинуть исключение при вызове dispatch раньше рендеринга компонента", () => {
    renderHook(() => {
      const args = { ...actionArgs };
      const resultActions = useActions(actions, args);

      expectJest(() => args.dispatch()).toThrowError(Error);

      return resultActions;
    });
  });
});

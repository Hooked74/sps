import { sleep } from "../sleep";

type TimeoutMock = jest.MockedFunction<typeof setTimeout>;

describe("utils/helpers/sleep", () => {
  it("Должен вызвать таймаут", async () => {
    const duration = 100;

    jest.spyOn(global, "setTimeout");
    (global.setTimeout as TimeoutMock).mockImplementation((resolve: Handler) => resolve());
    await sleep(duration);

    expectJest(setTimeout).toHaveBeenCalledTimes(1);
    expectJest(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), duration);
    (global.setTimeout as TimeoutMock).mockRestore();
  });
});

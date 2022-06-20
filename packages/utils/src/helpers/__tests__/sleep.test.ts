import { sleep } from "../sleep";
import { expect } from "@jest/globals";

type TimeoutMock = jest.MockedFunction<typeof setTimeout>;

describe("utils/helpers/sleep", () => {
  it("Должен вызвать таймаут", async () => {
    const duration = 100;

    jest.spyOn(global, "setTimeout");
    (global.setTimeout as TimeoutMock).mockImplementation((resolve: Handler) => resolve());
    await sleep(duration);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), duration);
    (global.setTimeout as TimeoutMock).mockRestore();
  });
});

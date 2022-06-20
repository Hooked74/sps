import { AxiosResponse } from "axios";
import { downloadFile } from "../downloadFile";
import { saveAs } from "file-saver";
import { v4 } from "uuid";
import { expect } from "@jest/globals";

const uuidv4ReturnValue = "mock-uuid-v4";

jest.mock("file-saver", () => ({ saveAs: jest.fn() }));
jest.mock("uuid", () => ({ v4: jest.fn() }));

describe("utils/helpers/downloadFile", () => {
  beforeEach(() => {
    (v4 as jest.MockedFunction<typeof v4>).mockReturnValue(uuidv4ReturnValue);
  });

  it("Должен получить имя файла из content-disposition", () => {
    const data = new Blob();
    const fileName = "mock";

    downloadFile({
      data,
      headers: {
        "content-disposition": `attachment; filename="${fileName}"`,
      } as Dictionary<string>,
    } as AxiosResponse);

    expect(saveAs).toHaveBeenCalledWith(data, fileName);
  });

  it("Должен получить имя файла из uuidv4", () => {
    const data = new Blob();

    downloadFile({ data, headers: {} } as AxiosResponse);

    expect(v4).toHaveBeenCalled();
    expect(saveAs).toHaveBeenCalledWith(data, uuidv4ReturnValue);
  });
});

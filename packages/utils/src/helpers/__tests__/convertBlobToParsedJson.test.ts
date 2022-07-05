import { convertBlobToParsedJson } from "../convertBlobToParsedJson";

describe("utils/helpers/convertBlobToParsedJson", () => {
  it("Должен получить JSON объект из Blob", async () => {
    const mockObject = { hello: "world" };
    const blob = new Blob([JSON.stringify(mockObject)], { type: "application/json" });

    const convertedObject = await convertBlobToParsedJson(blob);

    expectJest(convertedObject).toEqual(mockObject);
  });
});

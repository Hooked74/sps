import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";
import { BaseResponse } from "../types";

const getFileNameFromHeader = <Response extends BaseResponse<Blob>>(response: Response) =>
  response.headers["content-disposition"]?.replace(/^.+?filename="?(.+?)(".*)?$/i, "$1") ??
  uuidv4();

export const downloadFile = <Response extends BaseResponse<Blob>>(response: Response) =>
  saveAs(response.data, getFileNameFromHeader(response));

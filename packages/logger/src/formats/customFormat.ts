import { format, TransformFunction } from "logform";

export const customFormat = (transform: TransformFunction) => format(transform);

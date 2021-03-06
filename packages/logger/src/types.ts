import type {
  LoggerOptions as WinstonLoggerOptions,
  Logger as WinstonLogger,
  LogCallback as WinstonLogCallback,
  LogMethod as WinstonLogMethod,
} from "winston";
import type TransportStream from "winston-transport";
import type { LogLevels } from "./constants";

export interface LoggerOptions
  extends Omit<WinstonLoggerOptions, "levels" | "level" | "transports"> {
  serviceName: string;
  level?: LogLevels;
  overrideTransports?: boolean;
  transportsFactory?: () => TransportStream[];
}

export type UpdatedLoggerOptions = Omit<Partial<LoggerOptions>, "serviceName" | "defaultMeta">;

export interface LogMethod extends WinstonLogMethod {
  <Message>(level: LogLevels, message: Message, callback?: WinstonLogCallback): Logger;
  <Message, Meta>(
    level: LogLevels,
    message: Message,
    meta?: Meta,
    callback?: WinstonLogCallback
  ): Logger;
}

export declare class Logger extends WinstonLogger {
  log: LogMethod;
  configure(updatedOptions: UpdatedLoggerOptions): void;
}

/* eslint-disable no-console */
import type { LoggerOptions as WinstonLoggerOptions, Logger as WinstonLogger } from "winston";
import createLogger from "winston/lib/winston/create-logger";
import { levels } from "logform";
import { formats } from "./formats";
import { LoggerOptions, Logger, UpdatedLoggerOptions } from "./types";
import { DefaultWinstonFormattedLevels, LoggerLevels } from "./constants";
import { ConsoleTransport } from "./transports";

class _LoggerFactory {
  private readonly staticWinstonOptions: WinstonLoggerOptions = {
    levels: DefaultWinstonFormattedLevels.levels,
  };

  private readonly staticOptions: LoggerOptions = {
    serviceName: "default",
    level: LoggerLevels.INFO,
    transportsFactory: () => [
      new ConsoleTransport({
        handleExceptions: true,
        handleRejections: true,
      }),
    ],
    format: formats.combine(formats.timestamp(), formats.any()),
    exitOnError: false,
  };

  private defaultOptions: LoggerOptions;

  private existingLoggerMap = new Map<string, [WinstonLogger, LoggerOptions]>();

  constructor() {
    levels(DefaultWinstonFormattedLevels);
    this.reset();
  }

  private mergeOptions(defaultOptions: Partial<LoggerOptions>, options: Partial<LoggerOptions>) {
    return {
      ...defaultOptions,
      ...options,
      defaultMeta: { ...defaultOptions?.defaultMeta, ...options?.defaultMeta },
      transportsFactory:
        options?.overrideTransports ||
        (typeof options?.overrideTransports === "undefined" && defaultOptions?.overrideTransports)
          ? options?.transportsFactory ?? ((() => []) as LoggerOptions["transportsFactory"])
          : () => [
              ...(defaultOptions?.transportsFactory?.() ?? []),
              ...(options?.transportsFactory?.() ?? []),
            ],
    } as LoggerOptions;
  }

  private transformToWinstonOptions({
    serviceName,
    defaultMeta,
    overrideTransports,
    transportsFactory,
    ...winstonOptions
  }: LoggerOptions) {
    return {
      ...this.staticWinstonOptions,
      ...winstonOptions,
      defaultMeta: { ...defaultMeta, serviceName },
      transports: transportsFactory?.() ?? [],
    };
  }

  public updateOptions(updatedOptions: UpdatedLoggerOptions, isUpdateExistingLoggers = true) {
    this.defaultOptions = this.mergeOptions(this.defaultOptions, updatedOptions);

    if (isUpdateExistingLoggers) {
      this.existingLoggerMap.forEach(([logger]) => logger.configure(updatedOptions));
    }
  }

  public create(options: LoggerOptions) {
    if (this.existingLoggerMap.has(options.serviceName)) {
      throw new Error(`Logger with the serviceName "${options.serviceName}" already exists`);
    }

    const mergedOptions = this.mergeOptions(this.defaultOptions, options);
    const logger = createLogger(this.transformToWinstonOptions(mergedOptions)) as Logger;

    this.existingLoggerMap.set(options.serviceName, [logger, mergedOptions]);

    const configure = logger.configure as WinstonLogger["configure"];
    logger.configure = (updatedOptions: UpdatedLoggerOptions) => {
      const mergedOptions = this.mergeOptions(
        this.existingLoggerMap.get(options.serviceName)[1],
        updatedOptions
      );
      this.existingLoggerMap.set(options.serviceName, [logger, mergedOptions]);

      configure.call(logger, this.transformToWinstonOptions(mergedOptions));
    };

    return logger;
  }

  public reset() {
    this.defaultOptions = { ...this.staticOptions };
    this.existingLoggerMap.forEach(([logger]) => logger.close());
    this.existingLoggerMap.clear();
  }
}

export const LoggerFactory = new _LoggerFactory();

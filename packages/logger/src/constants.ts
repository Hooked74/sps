export enum LoggerLevels {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

export const DefaultWinstonFormattedLevels = {
  levels: {
    [LoggerLevels.ERROR]: 0,
    [LoggerLevels.WARN]: 1,
    [LoggerLevels.INFO]: 2,
    [LoggerLevels.DEBUG]: 3,
  },
  colors: {
    [LoggerLevels.ERROR]: "red",
    [LoggerLevels.WARN]: "yellow",
    [LoggerLevels.INFO]: "green",
    [LoggerLevels.DEBUG]: "blue",
  },
};

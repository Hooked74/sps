export enum LogLevels {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

export const DefaultWinstonFormattedLevels = {
  levels: {
    [LogLevels.ERROR]: 0,
    [LogLevels.WARN]: 1,
    [LogLevels.INFO]: 2,
    [LogLevels.DEBUG]: 3,
  },
  colors: {
    [LogLevels.ERROR]: "red",
    [LogLevels.WARN]: "yellow",
    [LogLevels.INFO]: "green",
    [LogLevels.DEBUG]: "blue",
  },
};

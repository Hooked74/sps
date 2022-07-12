declare module "winston/lib/winston/create-logger" {
  const createLogger: (options?: import("winston").LoggerOptions) => import("winston").Logger;

  export default createLogger;
}

declare module "winston/lib/winston/transports/console" {
  const ConsoleTransport: import("winston").transports.ConsoleTransportInstance;

  export default ConsoleTransport;
}

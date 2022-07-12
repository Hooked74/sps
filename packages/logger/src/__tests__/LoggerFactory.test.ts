import { LoggerFactory } from "../LoggerFactory";
import { LoggerLevels } from "../constants";
import { MockTransport } from "./__mocks__/LoggerFactory.mock";

jest.useFakeTimers();

describe("utils/helpers/LoggerFactory", () => {
  let consoleErrorMock: jest.SpyInstance;
  let consoleWarnMock: jest.SpyInstance;
  let consoleInfoMock: jest.SpyInstance;
  let consoleDebugMock: jest.SpyInstance;
  let consoleLogMock: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorMock = jest.spyOn(console, "error");
    consoleWarnMock = jest.spyOn(console, "warn");
    consoleInfoMock = jest.spyOn(console, "info");
    consoleDebugMock = jest.spyOn(console, "debug");
    consoleLogMock = jest.spyOn(console, "log");
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    LoggerFactory.reset();
  });

  it("Должен вызвать error", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "error";
    const logger = LoggerFactory.create({ serviceName: mockServiceName });

    logger.error(mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledWith(
      expectJest.objectContaining({
        message: mockObject,
        serviceName: mockServiceName,
        timestamp: expectJest.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      })
    );
  });

  it("Должен вызвать warn", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "warn";
    const logger = LoggerFactory.create({ serviceName: mockServiceName });

    logger.warn(mockObject);

    jest.runAllTimers();

    expectJest(consoleWarnMock).toHaveBeenCalledWith(
      expectJest.objectContaining({
        message: mockObject,
        serviceName: mockServiceName,
        timestamp: expectJest.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      })
    );
  });

  it("Должен вызвать info", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "info";
    const logger = LoggerFactory.create({ serviceName: mockServiceName });

    logger.info(mockObject);

    jest.runAllTimers();

    expectJest(consoleInfoMock).toHaveBeenCalledWith(
      expectJest.objectContaining({
        message: mockObject,
        serviceName: mockServiceName,
        timestamp: expectJest.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      })
    );
  });

  it("Должен вызвать debug(не отработает, так как уровень меньше)", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "debug";
    const logger = LoggerFactory.create({ serviceName: mockServiceName });

    logger.debug(mockObject);

    jest.runAllTimers();

    expectJest(consoleDebugMock).toHaveBeenCalledTimes(0);
  });

  it("Должен вызвать debug(передача уровня через опции)", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "debug";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
      level: LoggerLevels.DEBUG,
    });

    logger.debug(mockObject);

    jest.runAllTimers();

    expectJest(consoleDebugMock).toHaveBeenCalledWith(
      expectJest.objectContaining({
        message: mockObject,
        serviceName: mockServiceName,
        timestamp: expectJest.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      })
    );
  });

  it("Должна произойти ошибка при вызове несуществующего уровня логирования", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "verbose";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
      level: LoggerLevels.DEBUG,
    });

    expectJest(() => logger.verbose(mockObject)).toThrowError();
  });

  it("Должен вызвать все доступные уровни логирования через метод log", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "log";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
      level: LoggerLevels.DEBUG,
    });

    logger.log(LoggerLevels.ERROR, mockObject);
    logger.log(LoggerLevels.WARN, mockObject);
    logger.log(LoggerLevels.INFO, mockObject);
    logger.log(LoggerLevels.DEBUG, mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledTimes(1);
    expectJest(consoleWarnMock).toHaveBeenCalledTimes(1);
    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleDebugMock).toHaveBeenCalledTimes(1);
  });

  it("Должен вывести ошибку при вызове log с нейзвестным уровнем", () => {
    const mockServiceName = "log";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
    });

    logger.log("mock", fakerStatic.random.word());
    expectJest(consoleErrorMock).toHaveBeenCalledTimes(1);
  });

  it("Должен выводить только ошибки при смене уровня на error", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "log";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
      level: LoggerLevels.ERROR,
    });

    logger.log(LoggerLevels.ERROR, mockObject);
    logger.log(LoggerLevels.WARN, mockObject);
    logger.log(LoggerLevels.INFO, mockObject);
    logger.log(LoggerLevels.DEBUG, mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledTimes(1);
    expectJest(consoleWarnMock).toHaveBeenCalledTimes(0);
    expectJest(consoleInfoMock).toHaveBeenCalledTimes(0);
    expectJest(consoleDebugMock).toHaveBeenCalledTimes(0);
  });

  it("Должен добавить в лог мету по умолчанию", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockMetaObject = { meta: fakerStatic.random.word() };
    const mockServiceName = "info";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
      defaultMeta: mockMetaObject,
    });

    logger.info(mockObject);

    jest.runAllTimers();

    expectJest(consoleInfoMock).toHaveBeenCalledWith(
      expectJest.objectContaining({
        ...mockMetaObject,
        message: mockObject,
        serviceName: mockServiceName,
        timestamp: expectJest.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      })
    );
  });

  it("Должен добавить новый транспорт MockTransport", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "transports";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
      transportsFactory: () => [new MockTransport()],
    });

    logger.info(mockObject);

    jest.runAllTimers();

    expectJest(consoleInfoMock).toHaveBeenCalledWith(
      expectJest.objectContaining({
        message: mockObject,
        serviceName: mockServiceName,
        timestamp: expectJest.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      })
    );
    expectJest(consoleLogMock).toHaveBeenCalledWith(MockTransport.message);
  });

  it("Должен переопределить транспорты по умолчанию на MockTransport", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "transports";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
      overrideTransports: true,
      transportsFactory: () => [new MockTransport()],
    });

    logger.info(mockObject);

    jest.runAllTimers();

    expectJest(consoleInfoMock).toHaveBeenCalledTimes(0);
    expectJest(consoleLogMock).toHaveBeenCalledWith(MockTransport.message);
  });

  it("Должен переопределить опции логгера через configure", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "configure";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
    });

    logger.info(mockObject);

    jest.runAllTimers();

    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(0);

    logger.configure({
      transportsFactory: () => [new MockTransport()],
      level: LoggerLevels.ERROR,
    });

    logger.info(mockObject);
    logger.error(mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledTimes(1);
    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(1);
  });

  it("Должен обновить опции по умолчанию и опции существующих логгеров", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "update";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
    });

    logger.info(mockObject);

    jest.runAllTimers();

    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(0);

    LoggerFactory.updateOptions({
      transportsFactory: () => [new MockTransport()],
      level: LoggerLevels.ERROR,
    });

    logger.info(mockObject);
    logger.error(mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledTimes(1);
    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(1);

    const mockServiceName2 = "update2";
    const logger2 = LoggerFactory.create({
      serviceName: mockServiceName2,
    });

    logger2.info(mockObject);
    logger2.error(mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledTimes(2);
    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(2);
  });

  it("Должен обновить опции по умолчанию, без обновления опций существующих логгеров", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "update";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
    });

    logger.info(mockObject);

    jest.runAllTimers();

    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(0);

    LoggerFactory.updateOptions(
      {
        transportsFactory: () => [new MockTransport()],
        level: LoggerLevels.ERROR,
      },
      false
    );

    logger.info(mockObject);
    logger.error(mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledTimes(1);
    expectJest(consoleInfoMock).toHaveBeenCalledTimes(2);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(0);

    const mockServiceName2 = "update2";
    const logger2 = LoggerFactory.create({
      serviceName: mockServiceName2,
    });

    logger2.info(mockObject);
    logger2.error(mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledTimes(2);
    expectJest(consoleInfoMock).toHaveBeenCalledTimes(2);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(1);
  });

  it("Должен обновить опции по умолчанию, а после обновить опции логгера через configure", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "update";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
    });

    logger.info(mockObject);

    jest.runAllTimers();

    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(0);

    LoggerFactory.updateOptions({
      transportsFactory: () => [new MockTransport()],
      level: LoggerLevels.ERROR,
    });

    logger.info(mockObject);
    logger.error(mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledTimes(1);
    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(1);

    logger.configure({
      overrideTransports: true,
      transportsFactory: () => [new MockTransport()],
      level: LoggerLevels.DEBUG,
    });

    logger.debug(mockObject);
    logger.error(mockObject);

    jest.runAllTimers();

    expectJest(consoleErrorMock).toHaveBeenCalledTimes(1);
    expectJest(consoleDebugMock).toHaveBeenCalledTimes(0);
    expectJest(consoleLogMock).toHaveBeenCalledTimes(3);
  });

  it("Должен кинуть исключение при создании логгера с таким же serviceName", () => {
    const mockServiceName = "equal";

    LoggerFactory.create({
      serviceName: mockServiceName,
    });

    expectJest(() =>
      LoggerFactory.create({
        serviceName: mockServiceName,
      })
    ).toThrowError();
  });

  it("Должен сбросить все логгеры и обновить на стартовую конфигурацию", () => {
    const mockObject = { mock: fakerStatic.random.word() };
    const mockServiceName = "reset";
    const logger = LoggerFactory.create({
      serviceName: mockServiceName,
    });

    LoggerFactory.updateOptions({ level: LoggerLevels.DEBUG });
    LoggerFactory.reset();

    logger.info(mockObject);

    expectJest(consoleInfoMock).toHaveBeenCalledTimes(0);

    const logger2 = LoggerFactory.create({
      serviceName: mockServiceName,
    });

    logger2.info(mockObject);
    logger2.debug(mockObject);

    expectJest(consoleInfoMock).toHaveBeenCalledTimes(1);
    expectJest(consoleDebugMock).toHaveBeenCalledTimes(0);
  });
});

import { LoggerFactory, LogLevels } from "@h74-sps/logger";
import { EnvManager } from "@h74-sps/utils";

export const fetcherLogger = LoggerFactory.create({
  serviceName: "fetcher",
  level: EnvManager.get("SPS_FETCHER_LOG_LEVEL", LogLevels.WARN) as LogLevels,
});

import { LoggerFactory, LogLevels } from "@h74-sps/logger";
import { EnvManager } from "@h74-sps/utils";

export const reactContextStorageLogger = LoggerFactory.create({
  serviceName: "react-context-storage",
  level: EnvManager.get("SPS_REACT_CONTEXT_STORAGE_LOG_LEVEL", LogLevels.WARN) as LogLevels,
});

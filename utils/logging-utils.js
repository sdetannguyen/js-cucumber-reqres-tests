const config = require("config");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = config.get("logLevel");

function logInfo(message) {
  logger.info(message);
}

function logWarn(message) {
  logger.warn(message);
}

function logError(message) {
  logger.error(message);
}

function logDebug(message) {
  logger.debug(message);
}

function logTrace(message) {
  logger.trace(message);
}

module.exports = { logInfo, logWarn, logError, logDebug, logTrace };

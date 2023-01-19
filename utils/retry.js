/* eslint-disable no-unmodified-loop-condition */
const config = require("config");
const { sleep } = require("./time-utils");

let interrupted = false;

async function retry(functionToRun, retryCountInput, retryIntervalInput) {
  const retryCount = retryCountInput || config.get("retryCount.high") || 50;

  const retryInterval = retryIntervalInput || config.get("retryIntervalMs") || 1000;

  let tryCount = 0;
  while (tryCount <= retryCount && !interrupted) {
    try {
      await functionToRun();
      tryCount = retryCount + 1;
    } catch (err) {
      tryCount++;
      if (tryCount > retryCount) {
        throw err;
      }

      await sleep(retryInterval);
    }
  }
}

async function reset() {
  interrupted = false;
}

async function interrupt() {
  interrupted = true;
}

module.exports = {
  retry,
  reset,
  interrupt,
};

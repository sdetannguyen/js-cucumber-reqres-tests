/**
 * Await to wait a certain number of milliseconds
 * @param intervalMs
 */
async function sleep(intervalMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.abs(intervalMs));
  });
}

/**
 * Await to wait a certain number of seconds
 * @param intervalSeconds
 */
async function sleepSeconds(intervalSeconds) {
  return sleep(intervalSeconds * 1000);
}

/**
 * Await to wait a certain number of minutes
 * @param intervalMinutes
 */
async function sleepMinutes(intervalMinutes) {
  return sleepSeconds(intervalMinutes * 60);
}

module.exports = {
  sleep,
  sleepSeconds,
  sleepMinutes,
};

const { Before, After, Status } = require("@cucumber/cucumber");
const config = require("config");
const fs = require("fs");
const rimraf = require("rimraf");
const Webdriver = require("../../../webdriver/SeleniumWebdriver");
const PageConstructor = require("../page-objects/PageConstructor");
const pageConstants = require("../page-objects/constants");
const logger = require("../../../utils/logging-utils");

const TIMEOUT = 60 * 1000;

Before({ timeout: TIMEOUT, tags: "@browser" }, async function () {
  this.browser = true;
  try {
    this.driver = new Webdriver();
    this.pageConstructor = new PageConstructor(this.driver);
    this.pageConstants = pageConstants;
    await this.driver.init();

    this.navigateToPage = async (pageConstant, ...pageParameters) => {
      console.log("Before.Hook.this.navigateToPage");
      const page = this.pageConstructor.constructPage(pageConstant, ...pageParameters);
      await this.driver.navigateToPage(page);
      this.currentPage = page;
      return page;
    };
  } catch (err) {
    logger.logError(err);
  }
});

After({ timeout: TIMEOUT, tags: "@browser" }, async function (scenario) {
  try {
    // Remove download folder with files or empty folder
    rimraf.sync(config.get("browserDownloadDirectory"));

    if (scenario.result.status === Status.FAILED) {
      const directory = `${process.cwd()}/test/acceptance/screenshots`;
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }

      const filename = `${scenario.pickle.name.replace(/ /g, "_")}.png`;
      await this.driver.saveScreenshot(directory, filename);
    }
  } catch (err) {
    logger.logError(err);
  } finally {
    logger.logDebug("After browser disposal");
    if (this.driver) {
      await this.driver.dispose();
    }
  }
});

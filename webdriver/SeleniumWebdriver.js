const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const expect = require("expect");
const fs = require("fs");
const path = require("path");
const config = require("config");
const _ = require("lodash");
const logger = require("../utils/logging-utils");
const WebElement = require("./WebElement");
const { retry } = require("../utils/retry");

class SeleniumWebdriver {
  async init() {
    const browser = config.get("browser");
    switch (browser.toLowerCase()) {
      case "firefox":
        this.driver = await this.initFirefox();
        break;
      default:
        this.driver = await this.initChrome();
    }
    await this.driver.manage().setTimeouts({ implicit: 20000, pageLoad: 30000, script: 15000 });
  }

  async initChrome() {
    let builder = new Builder().forBrowser("chrome");
    if (config.has("gridHub")) {
      builder = builder.usingServer(config.get("gridHub"));
    }

    let options = new chrome.Options();
    if (config.get("runBrowserHeadless")) {
      options = options.headless();
    }

    options.setUserPreferences({
      "download.default_directory": `${process.cwd()}/${config.get("browserDownloadDirectory")}`,
    });

    options.addArguments("--window-size=1920,1080");
    options.addArguments("--start-maximized");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--ignore-certificate-errors");

    builder = builder.setChromeOptions(options);

    return await builder.build();
  }

  async initFirefox() {
    let builder = new Builder().forBrowser("firefox");
    let options = new firefox.Options();
    options = options.ensureCleanSession(true);
    builder = builder.setFirefoxOptions(options);
    return await builder.build();
  }

  async dispose() {
    await this.driver.quit();
  }

  async navigateToPage(pageObject) {
    const currentUrl = await this.driver.getCurrentUrl();
    if (currentUrl !== pageObject.url) {
      logger.logDebug(`Navigating to page ${pageObject.url}`);
      await retry(async () => {
        try {
          await this.driver.get(pageObject.url);
        } catch (error) {
          logger.logError(error);
        }
      });
    }
  }

  async saveScreenshot(directory, filename) {
    const actualLocation = `${directory}/${filename.replace(/ /g, "_")}`;
    const folder = path.dirname(actualLocation);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    const image = await this.driver.takeScreenshot();
    fs.writeFileSync(actualLocation, image, "base64");
    return image;
  }

  async getText(cssSelector) {
    const element = await this.findElement(cssSelector);
    return await element.getText();
  }

  async getTexts(cssSelector) {
    const elements = await this.findElements(cssSelector);
    const texts = [];
    for (let i = 0; i < elements.length; i++) {
      try {
        const text = await elements[i].getText();
        texts.push(text);
      } catch (error) {
        // Do nothing
      }
    }
    return texts;
  }

  async setText(cssSelector, value) {
    let success = false;
    await retry(async () => {
      try {
        const element = await this.findElement(cssSelector);
        await element.sendKeys(value);
        success = true;
      } catch (err) {
        // No need to do anything here
      }
      expect(success).toBe(true);
    });
  }

  async click(cssSelector) {
    logger.logDebug(`Clicking ${cssSelector}`);

    let success = false;
    await retry(async () => {
      try {
        const element = await this.findElement(cssSelector);
        await element.click();
        success = true;
      } catch (err) {
        // No need to do anything here
      }
      expect(success).toBe(true);
    });
  }

  async clickOnStaleElement(cssSelector) {
    logger.logDebug(`Clicking ${cssSelector}`);
    let success;
    await retry(
      async () => {
        try {
          const element = await this.findElement(cssSelector);
          await element.click();
          success = true;
        } catch (err) {
          const element = await this.findElement(cssSelector);
          await element.click();
          success = true;
        }
      },
      5,
      1000
    );
    expect(success).toBe(true);
  }

  async clickElementWithText(cssSelector, text) {
    let success = false;
    await retry(async () => {
      try {
        const element = await this.findElementByText(cssSelector, text);
        await element.click();
        success = true;
      } catch (err) {
        // No need to do anything here
      }
      expect(success).toBe(true);
    });
  }

  async sendKeys(cssSelector, keys) {
    await this.setText(cssSelector, keys);
  }

  async findElement(cssSelector) {
    let element;
    let error;
    await retry(async () => {
      try {
        const elements = await this.driver.findElements(By.css(cssSelector));
        expect(elements.length).toBeGreaterThan(0);
        element = elements[0];
      } catch (err) {
        if (!error || !_.isEqual(err, error)) {
          error = err;
          logger.logError(error);
        }
      }
    });

    logger.logDebug(element);
    return new WebElement(this.driver, element);
  }

  async findElements(cssSelector) {
    const childElements = await this.driver.findElements(By.css(cssSelector));
    const wrappedChildren = childElements.map((element) => new WebElement(this.driver, element));
    return wrappedChildren;
  }

  async findElementByText(cssSelector, text) {
    const elements = await this.findElements(cssSelector);
    const allText = await Promise.all(elements.map(async (element) => await element.getText()));
    const index = allText.findIndex((result) => result.toUpperCase().startsWith(text.toUpperCase()));
    return elements[index];
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }
}

module.exports = SeleniumWebdriver;

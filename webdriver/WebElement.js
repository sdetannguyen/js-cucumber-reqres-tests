const { By } = require("selenium-webdriver");
const { retry } = require("../utils/retry");
const expect = require("expect");

class WebElement {
  constructor(driver, innerWebElement) {
    this.driver = driver;
    this.innerWebElement = innerWebElement;
  }

  async getText() {
    let text;
    await retry(async () => {
      text = await this.innerWebElement.getAttribute("innerText");
    });
    return text;
  }

  async sendKeys(input) {
    await this.innerWebElement.sendKeys(input);
  }

  async click() {
    let success = false;
    await retry(async () => {
      try {
        await this.innerWebElement.click();
        success = true;
      } catch (err) {
        // No need to do anything here
      }
      expect(success).toBe(true);
    });
  }

  async findElement(cssSelector) {
    console.log("WebElement.findElement");
    const childElement = await this.innerWebElement.findElement(By.css(cssSelector));
    const wrappedChild = new WebElement(this.driver, childElement);
    return wrappedChild;
  }

  async findElements(cssSelector) {
    const childElements = await this.innerWebElement.findElements(By.css(cssSelector));
    const wrappedChildren = childElements.map((element) => new WebElement(this.driver, element));
    return wrappedChildren;
  }

  async findElementByXpath(xpathSelector) {
    const element = await this.innerWebElement.findElement(By.xpath(xpathSelector));
    return new WebElement(this.driver, element);
  }

  async findElementsByXpath(xpathSelector) {
    const elements = await this.innerWebElement.findElements(By.xpath(xpathSelector));
    return elements.map((element) => new WebElement(this.driver, element));
  }

  async findElementByText(cssSelector, text) {
    let elementToReturn;
    await retry(async () => {
      const elements = await this.findElements(cssSelector);
      const allText = await Promise.all(elements.map(async (element) => await element.getText()));
      const index = allText.findIndex((result) => result.toUpperCase().startsWith(text.toUpperCase()));
      elementToReturn = elements[index];
    });
    return elementToReturn;
  }

  async getElementText(cssSelector) {
    const element = await this.findElement(cssSelector);
    return await element.getText();
  }

  async getAttribute(attribute) {
    return await this.innerWebElement.getAttribute(attribute);
  }

  async scrollIntoView() {
    await this.driver.executeScript(`arguments[0].scrollIntoView()`, this.innerWebElement);
  }

  async getCss(cssValue) {
    return await this.innerWebElement.getCssValue(cssValue);
  }

  async getRect() {
    return await this.innerWebElement.getRect();
  }

  async isSelected() {
    return await this.innerWebElement.isSelected();
  }

  async isDisplayed() {
    return await this.innerWebElement.isDisplayed();
  }

  async moveMouseToElement() {
    const actions = this.driver.actions({ async: true });
    await actions.move({ origin: this.innerWebElement }).perform();
  }
}

module.exports = WebElement;

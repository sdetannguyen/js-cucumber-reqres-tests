const PageObjects = require("./PageObject");

class DashBoardPage extends PageObjects {
  constructor(driver, pageConstructor) {
    super(driver, pageConstructor, "");
    this.supportReqResSelector = "a[href='#support-heading']";
  }

  async clickReqResButton() {
    const element = await this.driver.findElement(this.supportReqResSelector);
    await element.click();
  }
}

module.exports = DashBoardPage;

const config = require("config");

class PageObjects {
  constructor(driver, pageConstructor, endpoint = "") {
    this.applicationUrl = config.get("applicationUrl");
    this.url = `${this.applicationUrl}/${endpoint}`;
    this.driver = driver;
    this.pageConstructor = pageConstructor;
  }
}

module.exports = PageObjects;

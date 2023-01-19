const Pages = require("./index");

class PageConstructor {
  constructor(driver) {
    this.driver = driver;
    this.pages = {};
    Object.values(Pages).map((keys) => (this.pages[keys.name] = keys.page), this);
  }

  constructPage(pageName, ...pageArguments) {
    return new this.pages[pageName](this.driver, this, ...pageArguments);
  }
}

module.exports = PageConstructor;

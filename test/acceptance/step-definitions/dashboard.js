const expect = require("expect");
const { Given, When, Then } = require("@cucumber/cucumber");
const { retry } = require("../../../utils/retry");
const pageConstants = require("../page-objects/constants");
const logger = require("../../../utils/logging-utils");

Given("I navigate to dashboard page", { timeout: 60 * 1000 }, async function () {
  const dashboardPage = await this.pageConstructor.constructPage(pageConstants.DASH_BOARD_PAGE);
  await this.driver.navigateToPage(dashboardPage);
  this.currentPage = dashboardPage;
});

When("I click Support Reqres button", async function () {
  console.log("444")
  await this.currentPage.clickReqResButton();
});

Then("The page is auto-scrolled to Support session", async function () {
  await retry(async () => {
    try {
      expect(await this.driver.getCurrentUrl()).toBe("https://reqres.in/#support-heading");
    } catch (error) {
      logger.logError(error);
      throw new Error(error);
    }
  });
});

const reporter = require("cucumber-html-reporter");

const options = {
  theme: "bootstrap",
  jsonFile: `${process.cwd()}/reports/cucumber-report.json`,
  output: "./reports/cucumber-report.html",
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    "App Version": "X.X.X",
    "Test Environment": "Staging",
    Browser: "Chrome  Latest",
    Platform: "MacOS",
    Parallel: "None",
    Executed: "Locally",
  },
};

reporter.generate(options);

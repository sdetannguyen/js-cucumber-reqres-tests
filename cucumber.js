const faker = require("faker");
const config = require("config");
const logger = require("./utils/logging-utils");

const runPrefix = `run${faker.datatype.number()}`;
logger.logInfo(`Test run prefix: ${runPrefix}`);
process.env.runPrefix = runPrefix;

const retryFlaky = config.get("retryFlakyTestCount");
const functionality = config.get("functionality");
let includeExpression = "";
let excludeExpression = "";

Object.keys(functionality).forEach(function (key) {
  if (functionality[key]) {
    if (includeExpression !== "") {
      includeExpression += "or ";
    }

    includeExpression += `@${key} `;
    excludeExpression += `and not @not_${key} `;
  } else {
    excludeExpression += `and not @${key} `;

    if (includeExpression !== "") {
      includeExpression += "or ";
    }
    includeExpression += `@not_${key} `;
  }
});

if (config.get("skipPendingTests")) {
  excludeExpression += "and not @pending ";
}
if (config.get("skipBugRaisedTests")) {
  excludeExpression += "and not @bugRaised ";
}

const tags = `(${includeExpression}) ${excludeExpression}`;
console.log(`TAGS: ${tags}`);

const defaultArgs = [
  `--tags "${tags}"`,
  `--retry ${retryFlaky}`,
  "--retry-tag-filter @flaky",
  "--format ./formatters/CustomSummaryFormatter.ts",
  "--publish-quiet",
  "--require test/common/step-definitions",
  "--require test/common/hooks",
  "--require-module ts-node/register",
  "--require 'test/common/step-definitions/**/*.js'",
  "--format json:cucumber-report.json",
];

module.exports = {
  default: defaultArgs.join(" "),
  api: [
    "test/api/features",
    "--require test/api/step-definitions",
    "--require test/api/hooks",
    "--require 'test/api/step-definitions/**/*.js'",
    `--parallel ${config.parallelism.api}`,
    ...defaultArgs,
  ].join(" "),
  acceptance: [
    "test/acceptance/features",
    "--require test/acceptance/step-definitions",
    "--require test/acceptance/hooks",
    "--require 'test/acceptance/step-definitions/**/*.js'",
    `--parallel ${config.parallelism.acceptance}`,
    ...defaultArgs,
  ].join(" "),
};

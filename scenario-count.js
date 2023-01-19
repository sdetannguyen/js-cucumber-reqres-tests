const glob = require("glob");
const fs = require("fs");
const Gherkin = require("@cucumber/gherkin");
const Messages = require("@cucumber/messages");
const _ = require("lodash");

printScenarioCount("./test/api/**/*.feature");
printScenarioCount("./test/acceptance/**/*.feature");

function printScenarioCount(folder) {
  const uuidFn = Messages.IdGenerator.uuid();
  const builder = new Gherkin.AstBuilder(uuidFn);
  const matcher = new Gherkin.GherkinClassicTokenMatcher();

  const parser = new Gherkin.Parser(builder, matcher);
  const ast = glob.sync(folder).map((path) => parser.parse(fs.readFileSync(path).toString()));

  let pendingCount = 0;
  let bugRaisedCount = 0;
  let flakyCount = 0;
  let activeCount = 0;
  let totalCount = 0;

  _.forEach(ast, function (x) {
    const feature = x.feature;
    if (!feature) {
      return;
    }

    const scenarios = _.filter(feature.children, (y) => y.scenario);
    const tags = _.map(feature.tags, (tag) => tag.name);

    let featureIsPending = false;
    if (tags.includes("@pending")) {
      pendingCount += scenarios.length;
      featureIsPending = true;
    }

    let featureIsBugRaised = false;
    if (tags.includes("@bugRaised")) {
      bugRaisedCount += scenarios.length;
      featureIsBugRaised = true;
    }

    let featureIsFlaky = false;
    if (tags.includes("@flaky")) {
      flakyCount += scenarios.length;
      featureIsFlaky = true;
    }

    _.forEach(scenarios, function (y) {
      const scenario = y.scenario;
      if (!scenario) {
        return;
      }

      const scenarioTags = _.map(scenario.tags, (tag) => tag.name);
      if (!featureIsPending && scenarioTags.includes("@pending")) {
        pendingCount++;
      }

      if (!featureIsBugRaised && scenarioTags.includes("@bugRaised")) {
        bugRaisedCount++;
      }

      if (!featureIsFlaky && scenarioTags.includes("@flaky")) {
        flakyCount++;
      }

      if (
        !featureIsPending &&
        !featureIsBugRaised &&
        !scenarioTags.includes("@pending") &&
        !scenarioTags.includes("@bugRaised")
      ) {
        activeCount++;
      }

      totalCount++;
    });
  });

  console.log(folder);
  console.log("\tPending: " + pendingCount);
  console.log("\tBug raised: " + bugRaisedCount);
  console.log("\tFlaky: " + flakyCount);
  console.log("\tActive: " + activeCount);
  console.log("\tTotal: " + totalCount);
}

import { formatterHelpers, IFormatterOptions, SummaryFormatter } from "@cucumber/cucumber";
import _ from "lodash";

interface ILogIssuesRequest {
  issues: any[];
  title: string;
}

const LINKED_TICKET_PREFIX_REGEX = /^@linkedTicket-/;
const BUG_RAISED_TAG = "@bugRaised";
const FLAKY_TAG = "@flaky";

export default class CustomSummaryFormatter extends SummaryFormatter {
  constructor(options: IFormatterOptions) {
    super(options);
  }

  logIssues({ issues, title }: ILogIssuesRequest): void {
    this.log(`${title}:\n\n`);
    issues.forEach((testCaseAttempt, index) => {
      this.log(
        formatterHelpers.formatIssue({
          colorFns: this.colorFns,
          number: index + 1,
          snippetBuilder: this.snippetBuilder,
          supportCodeLibrary: this.supportCodeLibrary,
          testCaseAttempt,
          printAttachments: this.printAttachments,
        })
      );

      const tags: string[] = testCaseAttempt.pickle.tags.map((tag: { name: string }) => tag.name);

      const linkedTickets = tags
        .filter((tag) => tag.match(LINKED_TICKET_PREFIX_REGEX))
        .map((tag) => tag.replace(LINKED_TICKET_PREFIX_REGEX, ""));

      const isFlaky = tags.includes(FLAKY_TAG);
      const bugRaised = tags.includes(BUG_RAISED_TAG);

      this.log("   Test Status \n");
      this.log("   --------------------\n");
      this.log(`   Marked as flaky: ${isFlaky}\n`);
      this.log(`   LS bug ticket raised for genuine failure: ${bugRaised} \n\n`);
      if (!_.isEmpty(linkedTickets)) {
        this.log(`   Linked tickets: ${linkedTickets.join(", ")} \n\n`);
      }

      if (!isFlaky && !bugRaised) {
        this.log(
          "   If this is a nightly build, please mark mark failing test as either @bugRaised (for genuine regressions) or @flaky \n\n"
        );
      }

      if (_.isEmpty(linkedTickets)) {
        this.log(
          "   No Jira ticket associated with test failure. If this is a nightly build, please raise a ticket and link it to this scenario using the @linkedTicket- tag.\n\n"
        );
      }
    });
  }
}

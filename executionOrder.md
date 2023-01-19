# Framework execution order

## Ordering details

```
cucumber.js
```
- To pick/un-pick (@ / @not_) test scenarios following tags name 
- To setup default test arguments: customSummaryFormatter, stepDefs, hooks, retry

```
browser-hooks.js
```
- To trigger Before, After each test scenario
    - Before: To init webdriver, page, pageConstructor
    - After: To create folder to store screenshots, quit webdriver
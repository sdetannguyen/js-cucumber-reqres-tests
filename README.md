# js-cucumber-reqres-tests
- 
Skeleton for automated E2E, API and smoke tests for https://reqres.in application

## Acceptance Tests

### Running Locally

- Set the environment variables in `test/acceptance/acceptance.conf`:


  ```
  export NODE_ENV="default"
  ```

It's often useful to log requests when you have issues. You can set the following env to do so:
```
export DEBUG=superagent
```

- Ensure that the version of the `chromedriver` dependency in `package.json` matches your local version of Chrome. This is likely to be different to the required version on the build server, so you will need to change this, otherwise you will see an error like this when running the tests:

  ```
  SessionNotCreatedError: session not created: This version of ChromeDriver only supports Chrome version 86
  ```

- Run the tests with

  ```
  yarn acceptance-test
  ```

  This will run all the tests for the configuration specified in the `NODE_ENV` environment variable.

- You can run a subset of the tests by providing additional tags to the command such as

  ```
  yarn acceptance-test --tags="@testcaseTagName"
  ```

  Tags can be found above each test in the features directory `test/acceptance/features/`

Alternatively, the tests can be run and debugged in VS Code using a launch.json such as
PS: you may need to set node path if you are using nvm, such as
`"runtimeExecutable": "/Users/<user>/.nvm/versions/node/v16.18.1/bin/node",`

### Debugging

Debugging your tests is possible by using the `--inspect-brk` flag and connecting a node debugger process. Furthermore you should set

```
CUCUMBER_DEFAULT_TIMEOUT
CUCUMBER_SETUP_TIMEOUT
```

environment variables to very high numbers to avoid the tests timing out during debugging.

## API Tests

As above, but can be run with

```
yarn api-test
```

with the same set of flags.

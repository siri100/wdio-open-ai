exports.config = {

    runner: 'local',

      specs: [
        '../specs/**/test.e2e.ts'
      ],
    maxInstances: 1,

    capabilities: [{
        "appium:platformName": "iOS",
        "appium:automationName": "XCUITest",
        "appium:deviceName": "iPhone 15 Pro",
        "appium:platformVersion": "17.0",
        "appium:udid": "XXXX",
        "appium:bundleId": "com.test.test",
        "appium:orientation": "PORTRAIT",
        "appium:app": "app/test.app",
        "appium:waitForIdleTimeout" : 3000
    }],


    logLevel: 'info',
    services: ['appium'],
    reporters: ['spec',
        ['allure', {
            outputDir: './allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
        }],],
    bail: 0,
    baseUrl: 'http://localhost',
    path: '/',
    connectionRetryCount: 3,
    port: 4723,
    framework: 'cucumber',
    cucumberOpts: {
          require: ["./step_definitions/*.ts"],
          timeout: 60000,
    },
    mochaOpts: {
      ui: 'bdd',
      timeout: 120000,
      requires: ['ts-node-register' ],
  },

  autoCompileOpts: {
      autoCompile: true,
      tsNodeOpts: {
          transpileOnly: true,
          project: 'tsconfig.json'
      },
      tsConfigPathsOpts: {
          baseUrl: './'
      }
  },

  }

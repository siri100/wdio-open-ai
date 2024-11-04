import { join } from 'node:path';


export const config: WebdriverIO.Config = {

    logLevel: 'error',
    bail: 0,
    baseUrl: '',
    waitforTimeout: 45000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: [
        [
            'appium',
            {
                args: {
                    allowInsecure: 'chromedriver_autodownload',
                },
            },
        ],
    ],

    framework: 'mocha',

    reporters: [
        'spec',
    ],

    specs: [
          '../specs/**/test.e2e.ts'
    ],
    port: 4723,
    hostname: '127.0.0.1',
    maxInstances: 3,
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000, // 60 seconds
    },
    capabilities: [
        {
            platformName: 'Android',
            'appium:deviceName': 'emulator-5554',
            'appium:platformVersion': '15',
            'appium:orientation': 'PORTRAIT',
            'appium:automationName': 'UiAutomator2',
            'appium:app': join(
                process.cwd(),
                'apps',
                'Android.SauceLabs.Mobile.Sample.app.2.7.1.apk',
            ),
            'appium:appPackage': 'com.swaglabsmobileapp',
            'appium:appActivity': 'com.swaglabsmobileapp.MainActivity',
            'appium:newCommandTimeout': 100000,
            'appium:adbExecTimeout': 60000,
            'appium:autoAcceptAlerts': true,
        },
    ],
};

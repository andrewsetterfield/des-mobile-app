import {
  browser,
} from 'protractor';
import { TEST_CONFIG } from '../test.config';
import LoginPage from '../pages/loginPage';
import DashboardPage from '../pages/dashboardPage';

const {
  Given,
  Then,
  When,
  setDefaultTimeout,
  After,
  Status,
  AfterAll,
} = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;
const fs = require('fs');

this.testCategory = 'b';

// We need this much timeout for the login process to complete
setDefaultTimeout(TEST_CONFIG.DEFAULT_TIMEOUT);

// Turn off syncronisation with Angular
browser.ignoreSynchronization = true;

let screenshotAlways = false;
browser.getProcessedConfig().then((config) => {
  screenshotAlways = config.screenshotAlways;
});

When('I launch the mobile app', () => {
  // Application is already launched by framework
});

Then('I should see the {string} page', (pageTitle) => {
  const dashboardTitle = '//ion-title[normalize-space(text()) = "My dashboard"]';
  return expect(dashboardTitle).to.equal(`//ion-title[normalize-space(text()) = "${pageTitle}"]`);
});

Given('I am not logged in', () => {
  // Wait for app to be ready
  browser.sleep(TEST_CONFIG.PAGE_LOAD_WAIT);
  browser.waitForAngular();

  DashboardPage.openBurgerMenu();
  // Log out if we are logged in
  LoginPage.logout();

  browser.driver.getCurrentContext().then((webviewContext) => {
    // Switch to NATIVE context
    browser.driver.selectContext('NATIVE_APP').then(() => {
      // Wait until we are on the login page before proceeding
      LoginPage.getToSignInPopUp();

      // Switch back to WEBVIEW context
      browser.driver.selectContext(LoginPage.getParentContext(webviewContext));
    });
  });
});

Given('I open the burger menu', () => {
  DashboardPage.openBurgerMenu();
});

When('I log in to the application as {string}', (username) => {
  LoginPage.login(username);

  // If the dashboard has loaded we should see the employee id
  // todo: kc seems we should also see employee id if landing page is loaded (see ln 107) which is right?
  const employeeId = DashboardPage.getEmployeeId(username);
  return expect(employeeId.isPresent()).to.eventually.be.true;
});

When(/^I wait "([^"]*)" seconds?$/, { timeout: 2 * 5000 }, async (seconds) => {
  await browser.sleep(seconds * 1000);
});

/**
 * Take a screenshot of the page at the end of the scenario.
 */
After(function (testCase) {
  if (screenshotAlways || testCase.result.status === Status.FAILED) {
    return browser.driver.takeScreenshot().then((screenShot) => {
      this.attach(screenShot, 'image/png');
    });
  }
});

/**
 * Output the UI processed config so it may be included in the HTML report.
 */
AfterAll(() => {
  browser.getProcessedConfig().then((config) => {
    fs.writeFile('./test-reports/e2e-test-config.json', JSON.stringify(config), (err) => {
      if (err) {
        return console.log(err);
      }
    });
  });
});

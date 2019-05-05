import XHR from '../src/services/xhr';
import { BASE_URL, WINDOWS, STORAGE } from '../src/constants';
import logger from '../src/services/logger';
import { __IS_DEV__ } from '../src/utils/is';
import { listen, broadcast, compose, send } from '../src/services/message';
import AuthController from './controllers/AuthWindow';
import ManagementController from './controllers/Management';
import PopupController from './controllers/BrowserPopup';
import DashboardsTracker from './controllers/Dashboards';
import ApplicationUser from './user';
import ApplicationSession from './session';

const AUTH = 'auth';
const NAV = 'nav';

const $log = logger('APP');

const AuthWindow = new AuthController({
  url: WINDOWS.auth,
  $log: $log.dive('AUTH_PAGE')
});

const ManagementPage = new ManagementController({
  url: WINDOWS.management,
  $log: $log.dive('MANAGEMENT_PAGE')
});

const BrowserPopup = new PopupController({
  config: {
    [AUTH]: WINDOWS.auth,
    [NAV]: WINDOWS.nav
  },
  $log: $log.dive('BROWSER_POPUP')
});

const Service = new XHR({
  BASE_URL,
  jsonp: true
});

chrome.runtime.onInstalled.addListener(() => {
  const $$log = $log.dive('WORKER');
  $$log.info('Start service worker installation upon Extension installation');
  navigator.serviceWorker.register('worker.js');
  navigator.serviceWorker.ready
    .then(() => {
      $$log.success('Service worker installed.');
    })
    .catch((err) => {
      $$log.error(`Service worker installation failed: ${err}`);
    });
});

const Dashboards = new DashboardsTracker({
  url: WINDOWS.dashboard,
  storage: STORAGE.DASHBOARD
});

const Session = new ApplicationSession({
  service: Service,
  onAuthorizationChange(authorized) {
    if (authorized) {
      return Promise.all([
        BrowserPopup.set(NAV),
        ManagementPage.open(),
        AuthWindow.remove(),
        broadcast('WINDOWS.WAKEUP'),
        Dashboards.restoreTabs(),
        Dashboards.getOpenedTabs().then((tabs) => tabs && send(tabs, 'WINDOWS.WAKEUP'))
      ]);
    } else {
      return Promise.all([
        BrowserPopup.set(AUTH),
        AuthWindow.open(),
        broadcast('WINDOWS.SUSPEND'),
        Dashboards.getOpenedTabs().then((tabs) => tabs && send(tabs, 'WINDOWS.SUSPEND'))
      ]);
    }
  }
});

const User = new ApplicationUser({
  service: Service,
  endpoint: 'user'
});

listen('SESSION.LOGIN', ({ data }, sender, done) => {
  Session.login(data)
    .then(done)
    .catch(done);
});

listen('SESSION.LOGOUT', (message, sender, done) => {
  Session.logout()
    .then(() => {
      return Promise.all([ManagementPage.remove(), Dashboards.removeAll()]);
    })
    .then(done)
    .catch(done);
});

listen('MANAGEMENT.NAVIGATE', ({ data }, sender, done) => {
  ManagementPage.open(data)
    .then(done)
    .catch(done);
});

listen('SESSION.EXPIRED', (message, sender, done) => {
  Session.unsetSession();
  done();
});

Session.initSession(User.fetch).then(({ authorized }) => {
  Service.on401Handler = Session.unsetSession;
});

if (__IS_DEV__) {
  window.Tr = {
    User,
    Service,
    Session,
    Dashboards,
    BrowserPopup,
    AuthWindow,
    ManagementPage
  };
}

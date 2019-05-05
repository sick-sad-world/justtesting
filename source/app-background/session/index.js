import bindAll from 'lodash/bindAll';
import { isFunc } from '../../src/utils/is';
import logger from '../../src/services/logger';

const authorized = Symbol('session.authorized');

export default class Session {
  constructor({ service, onAuthorizationChange = null } = {}) {
    this.service = service;
    const log = (this.logger = logger('SESSION'));

    const isAuthorizationListener = isFunc(onAuthorizationChange);

    this.state = {
      [authorized]: null,
      get authorized() {
        return this[authorized];
      },
      set authorized(val) {
        if (this[authorized] !== val) {
          this[authorized] = val;
          log.info(`Authentication ${val ? 'accquired' : 'lost'}`);
          if (isAuthorizationListener) {
            onAuthorizationChange(val);
          }
        }
        return { ...this };
      }
    };

    bindAll(this, 'setSession', 'unsetSession', 'login', 'logout');
  }

  getState() {
    return {
      authorized: this.state.authorized
    };
  }

  initSession(initPromise) {
    this.logger.info('Initialize...');
    return initPromise()
      .then(this.setSession)
      .catch(this.unsetSession);
  }

  login(data) {
    this.logger.info('Authorizing...');
    return this.service
      .request('login', data)
      .then(this.setSession)
      .catch((err) => {
        this.logger.error('Authorization failed', err);
        throw err;
      });
  }

  logout() {
    this.logger.info('Logging out...');
    return this.service.request('logout').then(this.unsetSession);
  }

  setSession() {
    this.state.authorized = true;
    return this.getState();
  }

  unsetSession() {
    this.state.authorized = false;
    return this.getState();
  }
}

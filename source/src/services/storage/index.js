import logger from '../logger';
export default class StorageAdapter {
  constructor({ namespace, type = 'sync', $log = logger('STORAGE') }) {
    this.logger = $log.dive(namespace);
    this.namespace = namespace;
    this.api = chrome.storage[type];
  }

  get() {
    return new Promise((res, rej) => {
      try {
        this.api.get([this.namespace], (result) => {
          const value = result[this.namespace];
          this.logger.success(value);
          res(value);
        });
      } catch (err) {
        this.logger.error(err);
        rej(err);
      }
    });
  }

  set(value) {
    return new Promise((res, rej) => {
      try {
        this.api.set({ [this.namespace]: value }, () => {
          this.logger.success(`Succesfully set to ${JSON.stringify(value)}`);
          res(value);
        });
      } catch (err) {
        this.logger.error(err);
        rej(err);
      }
    });
  }

  listen(func) {
    this.api.onChanged.addListener((change) => {
      if (change.hasOwnProperty(this.namespace)) {
        const { newValue, oldValue } = change[this.namespace];
        this.logger.info(`Change occured ${JSON.stringify(newValue)}`);
        func(newValue, oldValue);
      }
    });
  }
}

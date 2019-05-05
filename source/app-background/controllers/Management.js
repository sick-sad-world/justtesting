import logger from '../../src/services/logger';
import { createUrl, findWindowByUrl, createWindow, showWindow, removeWindow, updateTab } from '../../src/utils/chrome';

export default class ManagementWindow {
  constructor({ url, $log }) {
    this.logger = $log || logger('BROWSER_POPUP');
    this.window = null;
    this.url = url;
    this.params = {
      type: chrome.windows.WindowType.POPUP,
      state: chrome.windows.WindowState.MAXIMIZED
    };

    chrome.windows.onRemoved.addListener(this.onRemoved);
  }

  onRemoved = (id) => {
    if (this.window && this.window.id == id) {
      this.window = null;
    }
  };

  open(params) {
    if (this.window) {
      return this.show(params);
    } else if (this.url) {
      return findWindowByUrl(createUrl(this.url), this.logger).then((result) => {
        if (result) {
          this.window = result;
          return this.show(params);
        }
        return this.create(params);
      });
    } else {
      return this.create(params);
    }
  }

  create(params) {
    const url = createUrl(this.url, params);
    return createWindow({ ...this.params, url }, this.logger).then((window) => (this.window = window));
  }

  show(params) {
    const url = createUrl(this.url, params);
    return updateTab(this.window.tabs[0].id, { url }, this.logger).then((tab) => {
      this.window.tabs[0] = tab;
      return showWindow(this.window.id, this.logger);
    });
  }

  remove() {
    if (this.window && this.window.id) {
      return removeWindow(this.window.id, this.logger).then(() => (this.window = null));
    }
    return Promise.resolve();
  }
}

import logger from '../../src/services/logger';
import StorageAdapter from '../../src/services/storage';
import { createUrl, findTabs, createTab, removeTab } from '../../src/utils/chrome';

export default class DashboardsTracker {
  constructor(options) {
    const { url, param = 'uuid', storage, service } = options;

    this.$channel = new StorageAdapter({ namespace: storage });
    this.service = service;
    this.param = param;
    this.logger = logger('DASHBOARD_TRACKER');
    this.url = createUrl(url);
    this.idMap = new Map();

    chrome.tabs.onRemoved.addListener(this.onRemoved);
    this.$channel.listen(this.bindTabs);
  }

  onRemoved = (id) => {
    if (this.idMap.has(id)) {
      this.$channel.get().then((raw) => {
        const value = new Set(raw);
        value.delete(this.idMap.get(id));
        return this.$channel.set(Array.from(value));
      });
    }
  };

  getUuidFromUrl(str) {
    const url = new URL(str);
    const uuid = parseInt(url.searchParams.get(this.param));
    return !isNaN(uuid) ? uuid : null;
  }

  getURL(uuid) {
    const url = new URL(this.url);
    url.searchParams.append(this.param, uuid);
    return url.toString();
  }

  getTabByUuid(uuid) {
    return findTabs({ url: this.getURL(uuid) }, this.logger);
  }

  getOpenedTabs() {
    return findTabs({ url: `${this.url}*` }, this.logger);
  }

  bindTabs = (value) => {
    const valueSet = new Set(value);
    const toClear = [];
    this.idMap.clear();
    return this.getOpenedTabs()
      .then((tabs) =>
        tabs.map((tab) => ({
          ...tab,
          uuid: this.getUuidFromUrl(tab.url)
        }))
      )
      .then((tabs) => {
        tabs.forEach((tab) => {
          if (valueSet.has(tab.uuid)) {
            this.logger.info(`Dashboard uuid: ${tab.uuid} found tab: ${tab.id}`);
            valueSet.delete(tab.uuid);
            this.idMap.set(tab.id, tab.uuid);
          } else {
            this.logger.warn(`Dashboard uuid: ${tab.uuid} removed, but tab found add it to clear list`);
            toClear.push(tab.id);
          }
        });
        this.logger.info(`Clear obsolete tabs: ${toClear.join(', ')}`);

        const clearingBatch = toClear.map((id) => removeTab(id, this.logger));
        const creationBatch = Array.from(valueSet).map((uuid) =>
          createTab({ url: this.getURL(uuid) }, this.logger).then((tab) => {
            this.idMap.set(tab, uuid);
          })
        );

        return Promise.all([...clearingBatch, ...creationBatch]);
      });
  };

  removeAll() {
    return this.getOpenedTabs().then((tabs) => Promise.all(tabs.map((tab) => removeTab(tab.id, this.logger))));
  }

  restoreTabs() {
    return this.$channel.get().then(this.bindTabs);
  }
}

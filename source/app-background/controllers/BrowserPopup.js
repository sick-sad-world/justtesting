import logger from '../../src/services/logger';
import { createUrl, setBrowserPopup } from '../../src/utils/chrome';

export default class BrowserPopup {
  constructor({ config, $log }) {
    this.logger = $log || logger('BROWSER_POPUP');
    this.config = Object.entries(config).reduce((acc, [key, val]) => {
      acc[key] = createUrl(val);
      return acc;
    }, {});
    this.current = null;
  }

  set(target) {
    if (!this.config[target]) {
      return Promise.reject(`Popup may be one of [${Object.keys(this.config).join(', ')}]. But ${target} was given`);
    }
    return setBrowserPopup(this.config[target], this.logger).then(() => {
      this.current = target;
    });
  }

  unset() {
    return setBrowserPopup('', this.logger).then(() => {
      this.current = null;
    });
  }
}

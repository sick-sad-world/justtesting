import bindAll from 'lodash/bindAll';
import logger from '../../src/services/logger';

export default class ApplicationUser {
  constructor({ service, endpoint }) {
    this.endpoint = endpoint;
    this.service = service;
    this.user = null;
    this.logger = logger('USER');
    bindAll(this, 'fetch', 'setData', 'update');
  }

  fetch() {
    this.logger.info('Fetch data...');
    return this.service.request(this.endpoint).then(this.setData);
  }

  setData(data) {
    this.logger.info('Data accquired', { id: data.id, name: data.name });
    this.user = data;
    return data;
  }

  update(params) {
    this.logger.info('Send update data...');
    return this.service.request(this.endpoint, params).then(this.setData);
  }
}

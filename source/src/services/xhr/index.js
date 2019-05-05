import inv from '../../utils/inv';
import { isFunc } from '../../utils/is';
import fetch from './fetch';
import fetchJsonp from './fetch-jsonp';
import transformRequestData from './transform-request-data';
import transformResponceData from './transform-responce-data';

export default class XHR {
  constructor({ BASE_URL, on401Handler, jsonp = false }) {
    inv(BASE_URL, 'string');
    this.BASE_URL = BASE_URL;
    this.on401Handler = on401Handler;
    this.method = jsonp ? fetchJsonp : fetch;
    this.transformRequest = jsonp ? transformRequestData : (data) => data;
    this.transformResponce = jsonp ? transformResponceData : (data) => data;
  }

  check401 = (error) => {
    if (isFunc(this.on401Handler) && error.message === 'Not logged in') {
      this.on401Handler();
    }
    throw error;
  }

  request(url, params, opts) {
    return this.method({
      ...opts,
      body: this.transformRequest(params),
      url: `${this.BASE_URL}/${url}`
    })
      .then(this.transformResponce(params))
      .catch(this.check401);
  }
}

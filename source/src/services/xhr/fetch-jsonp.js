import jsonp from 'browser-jsonp';
import { NetworkError } from '../../utils/error';

// Just an wrapper to a third-party module
// which provides default settings and callback mapping
// ===========================================================================
export default function fetch({ body, ...params }) {
  let abort = null;
  const promise = new Promise((resolve, reject) => {
    const request = jsonp({
      ...params,
      data: body,
      error: reject,
      success: ({ error, ...data }) => {
        if (typeof error === 'string') {
          reject(new NetworkError(error));
        } else {
          resolve(data);
        }
      },
      complete() {
        abort();
      }
    });
    abort = request.abort;
  });
  promise.abort = abort;
  return promise;
}

import { NetworkError } from '../../utils/error';
import { isStr } from '../../utils/is';
import { encodeUrlParams } from '../../utils/url';

export default function fetchData({ url, body, ...params }) {
  return fetch(`${url}${encodeUrlParams(body)}`, params)
    .then((resp) => resp.json())
    .then(({ error, ...data }) => {
      if (isStr(error)) {
        throw error;
      }
      return data;
    })
    .catch((error) => {
      throw new NetworkError(error);
    });
}

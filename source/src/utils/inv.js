import is, { isStr } from './is';

export default function inv(param, type, message) {
  if (is(param, type)) {
    const text = isStr(message) ? message : `${type} expected. ${typeof param} was given`;
    const error = new TypeError(text);
    error.framesToPop = 1;
    throw error;
  }
}

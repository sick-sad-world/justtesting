import { isFunc } from './is';
import inv from './inv';

export function defaultPrevented(func) {
  inv(func, 'function');
  return (e) => {
    e.preventDefault();
    if (isFunc(e.persist)) {
      e.persist();
    }
    func(e);
  };
}

export function extractEventValue(func) {
  inv(func, 'function');
  return (e) => func(e.target.value);
}

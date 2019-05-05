export default function is(type, input) {
  return typeof input === type;
}

export const isFunc = (input) => is('function', input);

export const isStr = (input) => is('string', input);

export const isNumber = (input) => is('number', input) && !Number.isNaN(input);

export const isPromise = (obj) => {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    obj instanceof Promise &&
    isFunc(obj.then) &&
    isFunc(obj.catch)
  );
};

export const __IS_DEV__ = process.env.NODE_ENV === 'development';

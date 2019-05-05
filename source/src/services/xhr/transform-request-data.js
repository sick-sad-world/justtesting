import isPlainObject from 'lodash/isPlainObject';
import transform from 'lodash/transform';

// Transform data for serialization function
// Nested objects - to string, exclude [null, undefined]
// ===========================================================================
export default function transformRequestData(data) {
  if (!data) return {};

  return transform(
    data,
    (acc, v, k) => {
      // Objects and Arrays require explicit proccessing
      if (isPlainObject(v) || Array.isArray(v)) {
        acc[k] = JSON.stringify(v);
      }
      // null, undefine and empty strings will be filred out from request data
      else if (v !== null && v !== undefined && v !== '') {
        acc[k] = v;
      }

      return acc;
    },
    {}
  );
}

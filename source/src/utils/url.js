// Transform request parameters to URI Compatible string
// ===========================================================================
export function encodeUrlParams(params = {}) {
  let result = Object.keys(params);
  if (!result.length) {
    return '';
  }
  result = result
    .map((prop) => {
      return [prop, params[prop]].map(encodeURIComponent).join('=');
    })
    .join('&');

  return `?${result}`;
}

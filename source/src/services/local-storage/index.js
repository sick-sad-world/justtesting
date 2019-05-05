export default function storageAdapter(key, def = null) {
  return {
    get: () => JSON.parse(window.localStorage.getItem(key)) || def,
    set: (val = def) => localStorage.setItem(key, JSON.stringify(val))
  };
}

const styles = {
  info: ['border-left: 3px solid #17a2b8; padding-left: 6px; color:#17a2b8;', ''],
  warn: ['border-left: 3px solid #ffc107; padding-left: 6px; color:#ffc107;', ''],
  error: ['border-left: 3px solid #dc3545; padding-left: 6px; color:#dc3545;', ''],
  success: ['border-left: 3px solid #28a745; padding-left: 6px; color:#28a745;', '']
};

const compose = (path, args) => {
  return `%c${path}|%c=>${args.map(JSON.stringify).join(' ')}`;
};

export default function log(path) {
  return {
    info: (...args) =>
      console.log(
        compose(
          path,
          args
        ),
        ...styles.info
      ),
    warn: (...args) =>
      console.log(
        compose(
          path,
          args
        ),
        ...styles.warn
      ),
    error: (...args) =>
      console.log(
        compose(
          path,
          args
        ),
        ...styles.error
      ),
    success: (...args) =>
      console.log(
        compose(
          path,
          args
        ),
        ...styles.success
      ),
    dive: (sub) => log(`${path}|${sub}`)
  };
}

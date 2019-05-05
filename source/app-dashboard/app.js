import { broadcast, compose, listen } from '../src/services/message';
document.body.innerHTML = 'dashboard running';
listen('WINDOWS.SUSPEND', (message, sender, done) => {
  document.body.innerHTML = 'dashboard suspended';
  done();
});

listen('WINDOWS.WAKEUP', (message, sender, done) => {
  document.body.innerHTML = 'dashboard running';
  done();
});

import { STORAGE } from '../src/constants';
import StorageAdapter from '../src/services/storage';
import { broadcast, compose } from '../src/services/message';

const $Dashboards = (window.$Dashboards = new StorageAdapter({ namespace: STORAGE.DASHBOARD }));

const dash = document.getElementById('dash');
const management = document.getElementById('management');

$Dashboards.get().then((value) => {
  dash.innerHTML = value.map((id) => `<li>Dashboard: ${id}</li>`).join('');
});

$Dashboards.listen((value) => {
  dash.innerHTML = value.map((id) => `<li>Dashboard: ${id}</li>`).join('');
});

dash.addEventListener('click', (e) => {
  e.preventDefault();
  const uuid = parseInt(e.target.href);
  if (!uuid) return;
  broadcast(
    compose(
      'DASHBOARD.OPEN',
      { uuid }
    )
  );
});

management.addEventListener('click', (e) => {
  e.preventDefault();
  broadcast(
    compose(
      'MANAGEMENT.NAVIGATE',
      { hash: e.target.hash }
    )
  );
});

document.getElementById('logout').addEventListener('click', (e) => {
  e.preventDefault();
  broadcast(compose('SESSION.LOGOUT'))
    .then(window.close)
    .catch(window.close);
});

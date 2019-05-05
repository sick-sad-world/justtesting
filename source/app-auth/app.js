import { broadcast, compose } from '../src/services/message';

const state = document.getElementById('state');

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    username: e.target.elements.login.value,
    password: e.target.elements.password.value
  };

  state.innerHTML = 'Loading...';

  broadcast(
    compose(
      'SESSION.LOGIN',
      data
    )
  )
    .then(window.close)
    .catch((error) => {
      state.innerHTML = error.name + ': ' + error.message;
    });
});

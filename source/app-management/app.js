import React from 'react';
import { render } from 'react-dom';
import { STORAGE } from '../src/constants';
import StorageAdapter from '../src/services/storage';
import { listen } from '../src/services/message';

const $Dashboards = (window.$Dashboards = new StorageAdapter({ namespace: STORAGE.DASHBOARD }));

class TestApp extends React.Component {
  state = {
    id: '',
    appState: 'running',
    dashIds: []
  };

  constructor(props) {
    super(props);
    $Dashboards.listen(this.updateDashboards);
  }

  componentDidMount() {
    listen('WINDOWS.SUSPEND', (message, sender, done) => {
      this.setState({ appState: 'suspended' });
      done();
    });

    listen('WINDOWS.WAKEUP', (message, sender, done) => {
      this.setState({ appState: 'running' });
      done();
    });

    $Dashboards.get().then(this.updateDashboards);
  }

  updateDashboards = (value) => {
    this.setState({ dashIds: value || [] });
  };

  setId = (e) => {
    this.setState({ id: e.target.value });
  };

  addDashboard = (e) => {
    e.preventDefault();
    const uuid = parseInt(this.state.id);
    if (!uuid) return;
    $Dashboards.get().then((raw) => {
      const value = new Set(raw || []);
      value.add(uuid);
      return $Dashboards.set([...value]).then(() => {
        this.setState({ id: '' });
      });
    });
  };

  removeDashboard = (uuid) => () => {
    $Dashboards.get().then((raw) => {
      const value = new Set(raw || []);
      value.delete(uuid);
      return $Dashboards.set([...value]);
    });
  };

  render() {
    return (
      <div>
        <div>
          <b>Status:</b> management {this.state.appState}
        </div>
        <div>
          <b>Path:</b> {window.location.hash}
        </div>
        <br />
        <div>
          <b>Dashboards</b>
          <br />
          <em>click to remove</em>
          <ul>
            {this.state.dashIds.map((id) => (
              <li key={id} onClick={this.removeDashboard(id)}>
                {id}
              </li>
            ))}
          </ul>
        </div>
        <br />
        <form onSubmit={this.addDashboard}>
          <b>Add dashboard:</b>
          <input type='text' onChange={this.setId} value={this.state.id} />
          <button type='submit'>Add</button>
        </form>
      </div>
    );
  }
}

render(<TestApp />, document.getElementById('root'));

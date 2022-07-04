import React from 'react';
import logo from './logo.svg';
import './App.css';
import { api } from './api';
import { Constants } from 'twisted';
// import { Grommet } from 'grommet';

const App = () => {
  const test = async () => {
    const summoner = await api.summoner.byName('Doublelift', Constants.Regions.AMERICA_NORTH);
    console.log('summoner', summoner);
  };
  test();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;

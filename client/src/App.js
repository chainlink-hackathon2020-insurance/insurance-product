import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Form, Button } from 'rimble-ui';

/*
https://github.com/ConsenSys/rimble-ui
*/
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
      <Button type="submit" width={1}>
          Sign Up
        </Button>
        </a>
      </header>
    </div>
  );
}

export default App;

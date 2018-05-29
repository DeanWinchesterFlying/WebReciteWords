import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TopAppBar from './TopAppBar'
import ScrollableTabs from './ScrollableTabs'

class App extends Component {
  render() {
    return (
      <div className="App">
          <div>
              <TopAppBar/>
          </div>
          <div style={{ paddingTop: 70 }}>
              <ScrollableTabs/>
          </div>
      </div>
    );
  }
}

export default App;

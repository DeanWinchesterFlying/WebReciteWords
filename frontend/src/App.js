import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TopAppBar from './TopAppBar'
import ScrollableTabs from './ScrollableTabs'
import LoginCard from './LoginCard'
import {BrowserRouter, Route, Switch} from 'react-router-dom';

class App extends Component {
    state = {
        auth: false,
    };

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <div className="App">
                        <div>
                            <TopAppBar/>
                        </div>
                        <Switch>
                            <div>
                                <Route exact path={'/'} component={ScrollableTabs}/>
                                <Route path={'/login'} component={LoginCard}/>
                            </div>
                        </Switch>
                    </div>
                </Switch>
            </BrowserRouter>

        );
    }
}

export default App;

import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import TopAppBar from './TopAppBar'
import ScrollableTabs from './ScrollableTabs'
import LoginCard from './login/LoginCard'
import {BrowserRouter, Route, Switch} from 'react-router-dom';

class App extends Component {

    constructor(props) {
        super(props);
        localStorage.setItem('prefix', 'http://111.230.148.106:8000/api');
        localStorage.setItem('title', '秋酿英语');
    }

    state = {
        auth: false,
    };

    render() {
        document.title = localStorage.getItem('title');
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

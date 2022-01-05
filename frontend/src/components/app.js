import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Home from "./home/home"
import Login from "./login"
import Register from "./register"

class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Home />
                </Switch>
            </Router>
        )
    }
}

export default App;
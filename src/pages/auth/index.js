import React from 'react'
import Login from "./login"
import Register from './register'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom"; //runs react-router-dom v5.2.0, handles changes in url

export default function Auth () {
    return (
        <Router>
            <Switch>
                <Route path='/auth/login' component={Login}></Route>
                <Route path='/auth/register' component={Register}></Route>
            </Switch>
        </Router>
    )
}

  

  
import React from 'react'
import Join from './join';
import Participant from './participant';

import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom"; //runs react-router-dom v5.2.0, handles changes in url

export default function Stream () {
    return (
        <Router>
            <Switch>
                <Route path='/stream/join' component={Join}></Route>
                <Route path='/stream/participant' component={Participant}></Route>
            </Switch>
        </Router>
    )
}

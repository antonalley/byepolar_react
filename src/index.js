import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"; //runs react-router-dom v5.2.0, handles changes in url
import 'bootstrap/dist/css/bootstrap.css'
import Home from './pages/home';
import Auth from './pages/auth/index'
import NotFound from './pages/404';
import Ongoing from './pages/ongoing';
import Stream from './pages/stream/index'
import Navbar from './components/navbar';
import { AppContextProvider } from './hooks/context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppContextProvider>
    <div id="screen">
      <Navbar />
      <div className="main-content">
        <Router>
          <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route path='/auth/' component={Auth}></Route>
            <Route path='/ongoing' component={Ongoing}></Route>
            <Route path='/stream/' component={Stream}></Route>
            <Route component={NotFound}></Route>
          </Switch>
        </Router>
      </div>
    </div>
    </AppContextProvider>
  </React.StrictMode>
  
);


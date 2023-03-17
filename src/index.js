import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css'
import {
  BrowserRouter as Router,
  Route,
  Routes
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
      <Router>
        <div id="screen">
          <Navbar />
          <div className="main-content">
              <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path='/auth/' element={<Auth/>}></Route>
                <Route path='/ongoing' element={<Ongoing/>}></Route>
                <Route path='/stream/' element={<Stream/>}></Route>
                <Route element={<NotFound/>}></Route>
              </Routes>
          </div>
        </div>
      </Router>
    </AppContextProvider>
  </React.StrictMode>
  
);


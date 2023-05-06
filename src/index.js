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
import NotFound from './pages/404';
import Ongoing from './pages/ongoing';
import Navbar from './components/navbar';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Join from './pages/stream/join';
import Participant from './pages/stream/participant';
import { AppContextProvider } from './hooks/context';
import LiveStream from './pages/stream/participant_node';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppContextProvider>
    <Router>
      <div id="screen">
        <Navbar />
        <div className="main-content">
            <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path='/auth'>
                <Route path='login' element={<Login />}></Route>
                <Route path='register' element={<Register />}></Route>
                <Route path="" element={<NotFound/>}></Route>
              </Route>
              <Route path='/ongoing' element={<Ongoing/>}></Route>
              <Route path='/stream' >
                <Route path='join' element={<Join />}></Route>
                <Route path='participant' element={<Participant />}></Route>
                <Route path='livestreamtest' element={<LiveStream />}></Route>
                <Route path = "" element={<NotFound/>}></Route>
              </Route>
              <Route element={<NotFound/>}></Route>
            </Routes>
        </div>
      </div>
    </Router>
  </AppContextProvider>
  
);


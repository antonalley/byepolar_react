import React from 'react'
import Login from "./login"
import Register from './register'
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom"; //runs react-router-dom v5.2.0, handles changes in url

export default function Auth () {
    return (
        // <Router>
            <Routes>
                <Route path='/auth/login' element={<Login />}></Route>
                <Route path='/auth/register' element={<Register />}></Route>
            </Routes>
        // </Router>
    )
}

  

  
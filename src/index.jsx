import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
// import App from './App';

import Register from './components/Register/Register';
import LogIn from './components/LogIn/LogIn';
import LogOut from './components/LogOut/LogOut';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <Router>
      <Routes>
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<LogIn />} />
        <Route exact path="/logout" element={<LogOut />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

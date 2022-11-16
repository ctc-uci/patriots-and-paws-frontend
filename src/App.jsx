import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import ProtectedRoute from './utils/ProtectedRoute';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Dashboard from './components/Dashboard/Dashboard';

import AUTH_ROLES from './utils/AuthConfig';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute
                Component={Dashboard}
                redirectPath="/login"
                roles={[SUPERADMIN_ROLE, ADMIN_ROLE]}
              />
            }
          />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/logout"
            element={
              <ProtectedRoute
                Component={Logout}
                redirectPath="/login"
                roles={[SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE]}
              />
            }
          />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;

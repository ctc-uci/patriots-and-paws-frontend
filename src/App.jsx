import { ChakraProvider, Button, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DonationForm from './components/DonationForm/DonationForm';
import DropZone from './components/DropZone/DropZone';
import uploadImage from './utils/furnitureUtils';
import EditDonationForm from './pages/Dashboard/EditDonationForm';
import Drivers from './pages/Dashboard/Drivers';
import DriverRoutes from './pages/Dashboard/DriverRoutes';
import DonateStatus from './pages/donation/DonateStatus';

import ProtectedRoute from './utils/ProtectedRoute';
import EmailAction from './components/EmailAction/EmailAction';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';

import EmailSending from './components/EmailTemplates/EmailSending';
import SampleRoute from './components/SampleRoute/SampleRoute';

import AUTH_ROLES from './utils/AuthConfig';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

function App() {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  const onSubmit = async () => {
    const url = await uploadImage(files[0]);
    setImages(prev => [...prev, url]);
  };

  const Playground = () => {
    return (
      <>
        <EmailSending />
        <DropZone setFiles={setFiles} />
        <Button onClick={onSubmit}>Upload File</Button>
        {images.map(e => (
          <Image key={e} src={e} />
        ))}
      </>
    );
  };

  return (
    <ChakraProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/playground" element={<Playground />} />

          <Route
            exact
            path="/"
            element={
              <ProtectedRoute
                Component={Dashboard}
                redirectPath="/login"
                roles={[SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE]}
              />
            }
          />
          <Route
            exact
            path="/temp"
            element={
              <ProtectedRoute
                Component={SampleRoute}
                redirectPath="/login"
                roles={[SUPERADMIN_ROLE, ADMIN_ROLE]}
              />
            }
          />
          <Route
            exact
            path="/register"
            element={
              <ProtectedRoute
                Component={CreateAccount}
                redirectPath="/login"
                roles={[SUPERADMIN_ROLE, ADMIN_ROLE]}
              />
            }
          />
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
          <Route exact path="/email-action" element={<EmailAction redirectPath="/login" />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />

          <Route exact path="/donate/edit" element={<EditDonationForm />} />
          <Route exact path="/drivers/:id" element={<Drivers />} />
          <Route exact path="/driver-routes/:id" element={<DriverRoutes />} />
          <Route exact path="/donate" element={<DonationForm />} />
          <Route exact path="/donate/status" element={<DonateStatus />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;

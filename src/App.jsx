import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DonationForm from './components/DonationForm/DonationForm';

import Dashboard from './pages/dashboard/Dashboard';
import EditDonationForm from './pages/dashboard/EditDonationForm';
import Drivers from './pages/dashboard/Drivers';
import DriverRoutes from './pages/dashboard/DriverRoutes';
import DonateStatus from './pages/donation/DonateStatus';

function App() {
  return (
    <Router>
      <ChakraProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/donate/edit" element={<EditDonationForm />} />
          <Route path="/drivers:id" element={<Drivers />} />
          <Route path="/driver-routes:id" element={<DriverRoutes />} />
          <Route path="/donate" element={<DonationForm />} />
          <Route path="/donate/status" element={<DonateStatus />} />
        </Routes>
      </ChakraProvider>
    </Router>
  );
}

export default App;

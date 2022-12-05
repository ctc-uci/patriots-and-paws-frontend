import { ChakraProvider, Button, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DonationForm from './components/DonationForm/DonationForm';
import DropZone from './components/DropZone/DropZone';
import uploadImage from './util/furnitureUtils';
import Dashboard from './pages/dashboard/Dashboard';
import EditDonationForm from './pages/dashboard/EditDonationForm';
import Drivers from './pages/dashboard/Drivers';
import DriverRoutes from './pages/dashboard/DriverRoutes';
import DonateStatus from './pages/donation/DonateStatus';

function App() {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  const onSubmit = async () => {
    const url = await uploadImage(files[0]);
    setImages(prev => [...prev, url]);
  };

  return (
    <Router>
      <ChakraProvider>
        <DropZone setFiles={setFiles} />
        <Button onClick={onSubmit}>Upload File</Button>
        {images.map(e => (
          <Image key={e} src={e} />
        ))}
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

import { ChakraProvider, Button, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DropZone from './components/DropZone/DropZone';
import uploadImage from './util/furnitureUtils';
import DonationForm from './components/DonationForm/DonationForm';

import Dashboard from './pages/dashboard/Dashboard';
import DonateEdit from './pages/dashboard/DonateEdit';
import Drivers from './pages/dashboard/Drivers';
import RoutesPage from './pages/dashboard/Routes';
import Donate from './pages/donation/Donate';
import DonateStatus from './pages/donation/DonateStatus';

// hardcoded values for the rotue parameters
const driverOne = 1;
const routeOne = 'down fifth avenue';

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
        <DonationForm />
      </ChakraProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/donate/edit" element={<DonateEdit />} />
        <Route path="/drivers" driver={driverOne} element={<Drivers />} />
        <Route path="/routes" route={routeOne} element={<RoutesPage />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donate/status" element={<DonateStatus />} />
      </Routes>
    </Router>
  );
}

export default App;

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import './App.css';
import DonationForm from './components/DonationForm/DonationForm';

function App() {
  return (
    <ChakraProvider>
      <DonationForm />
    </ChakraProvider>
  );
}

export default App;

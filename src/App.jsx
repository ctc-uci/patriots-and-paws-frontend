import { ChakraProvider, Button, Stack } from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons';
import React from 'react';
import './App.css';
import DonationForm from './components/DonationForm';

function App() {
  return (
    <ChakraProvider>
      <Stack spacing={4} direction="column" align="center">
        <PhoneIcon />
        <Button colorScheme="teal" size="lg">
          Test
        </Button>
        <Button colorScheme="teal" size="lg">
          Button
        </Button>
      </Stack>
      <DonationForm />
    </ChakraProvider>
  );
}

export default App;

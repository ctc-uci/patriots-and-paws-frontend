import { ChakraProvider, Button, Stack } from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons';
import React from 'react';
import SendEmail from './components/SendEmail';
import './App.css';

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
        <SendEmail />
      </Stack>
    </ChakraProvider>
  );
}

export default App;

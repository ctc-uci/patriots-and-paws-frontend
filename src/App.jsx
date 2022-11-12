import { ChakraProvider } from '@chakra-ui/react';
import React, { useState } from 'react';
import './App.css';
import DropZone from './components/DropZone/DropZone';

function App() {
  const [files, setFiles] = useState([]);

  return (
    <ChakraProvider>
      <DropZone setFiles={setFiles} />
      {files}
    </ChakraProvider>
  );
}

export default App;

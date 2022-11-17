import { ChakraProvider, Button, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import './App.css';
import DropZone from './components/DropZone/DropZone';
import uploadImage from './util/furnitureUtils';

function App() {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  const onSubmit = async () => {
    const url = await uploadImage(files[0]);
    setImages(prev => [...prev, url]);
  };

  return (
    <ChakraProvider>
      <DropZone setFiles={setFiles} />
      <Button onClick={onSubmit}>Upload File</Button>
      {images.map(e => (
        <Image key={e} src={e} />
      ))}
    </ChakraProvider>
  );
}

export default App;

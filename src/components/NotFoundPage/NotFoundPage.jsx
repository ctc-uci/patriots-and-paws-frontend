import React from 'react';
import { Box, Button, Text, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import notFoundDog from './notFoundDog.png';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box marginLeft="25%" height="100vh" paddingTop="15%">
        <Text fontSize="6xl" as="b">
          404
        </Text>
        <Text fontSize="5xl">Page Not Found</Text>
        <Text fontSize="xl">Oops! Something went wrong</Text>
        <Button my="5%" bg="#3182CE" color="white" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Box>
      <Image src={notFoundDog} pos="fixed" bottom="0" right="0" />
    </>
  );
};

export default NotFoundPage;

import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex } from '@chakra-ui/react';
import React from 'react';

const AlertBanner = () => {
  return (
    <Alert status="warning" rounded="md" ml={{ md: '10%' }} mb="1%" width={{ md: '45%' }}>
      <Flex direction="row" verticalAlign="center" align="center">
        <AlertIcon ml="0.75%" boxSize="5.5%" />
        <Flex direction="column" ml="0.75%">
          <AlertTitle fontSize="md">Donor Rejected Scheduled Date</AlertTitle>
          <AlertDescription fontSize="md" fontWeight="normal" mt="0.25%">
            Please select a new date to continue.
          </AlertDescription>
        </Flex>
      </Flex>
    </Alert>
  );
};

export default AlertBanner;

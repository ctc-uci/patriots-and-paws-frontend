import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Button, Grid, GridItem, Text } from '@chakra-ui/react';
import { verifyDonorLogin } from '../../utils/donorUtils';
import DonorDashboard from '../../components/DonorDashboard/DonorDashboard';
// import styles from './DonorLogin.module.css';

const DonorLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [donationId, setDonationId] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    if (await verifyDonorLogin(donationId, email)) {
      setIsLoggedIn(true);
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <>
          <Grid templateColumns="repeat(2, 1fr)" gap={0}>
            <GridItem w="100%" h="100%" bgGradient="linear(to-br, red.200, blue.600)" />

            <GridItem w="100%" h="100%" textAlign="center" fontSize={40} bgColor="green.200">
              <Text fontSize="4xl" fontWeight="bold">
                <h1>Donor Login</h1>
              </Text>
              <Text fontSize="medium">
                <p>First time donating? Donate Here</p>
              </Text>

              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Donation ID</FormLabel>
                  <Input
                    type="text"
                    placeholder="########"
                    value={donationId}
                    onChange={e => setDonationId(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </FormControl>

                <Button colorScheme="blue" type="submit">
                  Login
                </Button>
              </form>
            </GridItem>
          </Grid>
        </>
      ) : (
        <DonorDashboard email={email} donationId={donationId} />
      )}
    </>
  );
};

export default DonorLogin;

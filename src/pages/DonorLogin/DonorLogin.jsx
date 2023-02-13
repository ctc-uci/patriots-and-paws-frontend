import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Button, Grid, GridItem, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { verifyDonorLogin } from '../../utils/donorUtils';
import DonorDashboard from '../../components/DonorDashboard/DonorDashboard';
import styles from './DonorLogin.module.css';

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
            <GridItem w="100%" h="100vh" bgGradient="linear(to-br, red.200, blue.600)" />

            <GridItem w="100%" className={styles.formContainer}>
              <div className={styles.formContent}>
                <Text fontSize="45px" fontWeight="700">
                  Donor Login
                </Text>
                <Text fontSize="15px" fontWeight="400" className={styles.info}>
                  First time donating?{' '}
                  <Link to="/donate/form" className={styles.link}>
                    Donate Here
                  </Link>
                </Text>

                <form onSubmit={handleSubmit}>
                  <FormControl isRequired className={styles.formInput}>
                    <FormLabel>Donation ID</FormLabel>
                    <Input
                      type="text"
                      placeholder="########"
                      value={donationId}
                      onChange={e => setDonationId(e.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired className={styles.formInput}>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </FormControl>

                  <Button colorScheme="blue" type="submit" w="100%" marginTop="20px">
                    Login
                  </Button>
                </form>
              </div>
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

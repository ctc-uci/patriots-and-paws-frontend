import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Grid,
  GridItem,
  Text,
  Box,
  Link,
} from '@chakra-ui/react';
import { Link as ReactLink, useLocation } from 'react-router-dom';
import { verifyDonorLogin } from '../../utils/donorUtils';
import DonorDashboard from '../../components/DonorDashboard/DonorDashboard';

const DonorLogin = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(location.state?.isLoggedIn || false);
  const [email, setEmail] = useState(location.state?.email || '');
  const [donationId, setDonationId] = useState(location.state?.donationId || '');
  const [loginFailed, setLoginFail] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    if (await verifyDonorLogin(donationId, email)) {
      setIsLoggedIn(true);
    } else {
      setLoginFail(true);
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <>
          <Grid templateColumns="repeat(2, 1fr)" gap={0}>
            <GridItem w="100%" h="100vh" bgGradient="linear(to-br, red.200, blue.600)" />

            <GridItem w="100%" display="flex" alignItems="center" justifyContent="center">
              <Box w="30vw">
                <Text fontSize="45px" fontWeight="700">
                  Donor Login
                </Text>
                <Text fontSize="15px" fontWeight="400" mt="-7px" mb="50px">
                  First time donating?{' '}
                  <Link
                    as={ReactLink}
                    to="/donate/form"
                    textDecoration="underline"
                    color="blue.500"
                  >
                    Donate Here
                  </Link>
                </Text>

                <form onSubmit={handleSubmit}>
                  <FormControl isRequired mb="40px">
                    <FormLabel>Donation ID</FormLabel>
                    <Input
                      type="text"
                      placeholder="########"
                      value={donationId}
                      onChange={e => setDonationId(e.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired mb="10px">
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </FormControl>
                  {loginFailed && (
                    <Text color="red" fontSize="14px">
                      Donation ID and email do not match
                    </Text>
                  )}

                  <Button colorScheme="blue" type="submit" w="100%" mt="50px">
                    Login
                  </Button>
                </form>
              </Box>
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

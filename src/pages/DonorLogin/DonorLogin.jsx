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
import { Link as ReactLink, useLocation, useNavigate } from 'react-router-dom';
import { verifyDonorLogin } from '../../utils/DonorUtils';
import DonorDashboard from '../../components/DonorDashboard/DonorDashboard';

const DonorLogin = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(location.state?.isLoggedIn || false);
  const [email, setEmail] = useState(location.state?.email || '');
  const [donationId, setDonationId] = useState(location.state?.donationId || '');
  const [loginFailed, setLoginFail] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    if (await verifyDonorLogin(donationId, email)) {
      navigate('/donate', {
        state: { isLoggedIn: true, email, donationId },
      });
      setIsLoggedIn(true);
    } else {
      setLoginFail(true);
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <>
          <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={0} display={{ md: 'flex' }}>
            <GridItem
              w="100%"
              h={{ base: '50vh', md: '100vh' }}
              bgGradient="linear(to-br, red.200, blue.600)"
            />

            <GridItem w="100%" display="flex" alignItems="center" justifyContent="center">
              <Box w={{ base: '80vw', md: '30vw' }}>
                <Text
                  fontSize={{ base: '30px', md: '45px' }}
                  fontWeight="700"
                  mt={{ base: 4, md: 0 }}
                  mb={{ base: 4, md: 0 }}
                >
                  Donor Login
                </Text>
                <Text
                  fontSize="15px"
                  fontWeight="400"
                  display={{ base: 'none', md: 'block' }}
                  mb="50px"
                >
                  First time donating?&nbsp;
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
                  <FormControl isRequired mb="10px">
                    <FormLabel>Donation ID</FormLabel>
                    <Input
                      type="text"
                      placeholder="########"
                      value={donationId}
                      onChange={e => setDonationId(e.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired mb="40px">
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

                  <Button
                    colorScheme="blue"
                    type="submit"
                    w="100%"
                    mt={{ base: 5, md: 50 }}
                    mb={{ base: 10, md: 0 }}
                  >
                    Login
                  </Button>
                  <Text
                    textAlign="center"
                    fontSize="15px"
                    fontWeight="400"
                    display={{ base: 'block', md: 'none' }}
                    mb="50px"
                  >
                    First time donating?&nbsp;
                    <Link
                      as={ReactLink}
                      to="/donate/form"
                      textDecoration="underline"
                      color="blue.500"
                    >
                      Donate Here
                    </Link>
                  </Text>
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

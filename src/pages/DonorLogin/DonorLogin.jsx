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
  Flex,
  Heading,
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
          <Grid
            templateColumns={{ md: 'repeat(2, 1fr)' }}
            templateRows={{ base: 'repeat(2, 1fr)', md: 'none' }}
            gap={0}
            display={{ md: 'flex' }}
          >
            <GridItem
              w="100%"
              h={{ base: '50vh', md: '100vh' }}
              bgGradient="linear(to-br, red.200, blue.600)"
            />

            <GridItem w="100%" display="flex" alignItems="center" justifyContent="center">
              <Flex p={{ base: '25px', md: 0 }}>
                <Box w={{ base: '80vw', md: '30vw' }}>
                  <Heading
                    fontSize={{ base: '25px', md: '45px' }}
                    fontWeight="700"
                    mb={{ base: '30px', md: 0 }}
                  >
                    Donor Login
                  </Heading>
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
                    <FormControl isRequired mb={{ base: '25px', md: '40px' }}>
                      <FormLabel>Donation ID</FormLabel>
                      <Input
                        type="text"
                        placeholder="########"
                        value={donationId}
                        onChange={e => setDonationId(e.target.value)}
                      />
                    </FormControl>

                    <FormControl isRequired mb={{ base: '30px', md: '40px' }}>
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
                      mt={{ base: 0, md: 30 }}
                      mb={{ base: '30px', md: 0 }}
                    >
                      Login
                    </Button>
                    <Text
                      textAlign="center"
                      fontSize="15px"
                      fontWeight="400"
                      display={{ base: 'block', md: 'none' }}
                    >
                      First time donating?&nbsp;
                      <Link as={ReactLink} to="/donate/form" textDecoration="none" color="blue.500">
                        Donate Here
                      </Link>
                    </Text>
                  </form>
                </Box>
              </Flex>
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

import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Link,
  Stack,
  Alert,
  AlertIcon,
  Box,
  Spinner,
  Grid,
  GridItem,
  AlertTitle,
} from '@chakra-ui/react';
import { Cookies, withCookies } from '../../utils/CookieUtils';
import { logInWithEmailAndPassword, useNavigate, userIsAuthenticated } from '../../utils/AuthUtils';

const Login = ({ cookies }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const formSchema = yup.object({
    email: yup.string().email().required('Please enter your email address'),
    password: yup.string().required('Please enter your password'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const { search } = useLocation();
  const signup = new URLSearchParams(search).get('signup');

  useEffect(() => {
    const checkUserAuthentication = async () => {
      const authenticated = await userIsAuthenticated(cookies);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    checkUserAuthentication();
  }, []);

  /**
   * This function handles logging in with email/password (standard log in)
   * If the user signs in successfully, they are redirected to the dashboard, otherwise they are redirected to the login screen
   * @param {Event} e
   */
  const handleLogin = async e => {
    try {
      await logInWithEmailAndPassword(e.email, e.password, '/', navigate, cookies);
    } catch (err) {
      const errorCode = err.code;
      const firebaseErrorMsg = err.message;

      if (errorCode === 'auth/wrong-password') {
        setErrorMessage('Email address or password does not match our records!');
      } else if (errorCode === 'auth/invalid-email') {
        setErrorMessage('Email address or password does not match our records!');
      } else if (errorCode === 'auth/unverified-email') {
        setErrorMessage('Please verify your email address.');
      } else if (errorCode === 'auth/user-not-found') {
        setErrorMessage('Email address or password does not match our records!');
      } else if (errorCode === 'auth/user-disabled') {
        setErrorMessage('This account has been disabled.');
      } else if (errorCode === 'auth/too-many-requests') {
        setErrorMessage('Too many attempts. Please try again later.');
      } else if (errorCode === 'auth/user-signed-out') {
        setErrorMessage('You have been signed out. Please sign in again.');
      } else {
        setErrorMessage(firebaseErrorMsg);
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={0}>
      <GridItem w="100%" h="100vh" bgGradient="linear(to-br, #F37C7C, #435FC0)" />
      <GridItem>
        <Flex minH="100vh" align="center" justify="center">
          <Stack align="center" width="100%" margin="auto">
            <Stack width="70%" padding={9}>
              {signup === 'success' && (
                <Alert status="success" variant="solid" bgColor="green">
                  <AlertIcon />
                  You have successfully logged in.
                </Alert>
              )}
              {errorMessage && (
                <Alert status="error" rounded="md" mb="1em">
                  <Flex direction="row" verticalAlign="center" align="center">
                    <AlertIcon ml="0.75%" boxSize="5.5%" />
                    <Flex direction="column" ml="0.75%">
                      <AlertTitle fontSize="md">{errorMessage}</AlertTitle>
                    </Flex>
                  </Flex>
                </Alert>
              )}
              <Heading fontSize="3rem">Staff Login</Heading>
              <Link href="/forgot-password" color="#3182ce" fontSize="1rem">
                Forgot Password?
              </Link>
              <Stack width="100%">
                <form onSubmit={handleSubmit(handleLogin)}>
                  <FormControl isRequired>
                    <FormLabel fontSize="16px" fontWeight="500" mt={10}>
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      id="email"
                      placeholder="name@domain.com"
                      {...register('email')}
                      isRequired
                    />
                    <Box>{errors.email?.message}</Box>
                    <FormLabel fontSize="16px" fontWeight="500" mt={10}>
                      Password
                    </FormLabel>
                    <Input
                      type="password"
                      id="password"
                      placeholder="***********"
                      {...register('password')}
                      isRequired
                    />
                    <Box>{errors.password?.message}</Box>
                    <Button colorScheme="blue" type="submit" width="100%" mt={14}>
                      Login
                    </Button>
                  </FormControl>
                </form>
              </Stack>
            </Stack>
          </Stack>
        </Flex>
      </GridItem>
    </Grid>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);

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
} from '@chakra-ui/react';
import styles from './Login.module.css';
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
        setErrorMessage('Invalid password');
      } else if (errorCode === 'auth/invalid-email') {
        setErrorMessage('Invalid email address');
      } else if (errorCode === 'auth/unverified-email') {
        setErrorMessage('Please verify your email address.');
      } else if (errorCode === 'auth/user-not-found') {
        setErrorMessage('There is no account associated with this email address.');
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
    <Flex minH="100vh" align="center" justify="center">
      <Stack align="center" spacing="2em">
        {signup === 'success' && (
          <Alert status="success" variant="solid">
            <AlertIcon />
            Account successfully created! Please verify your email.
          </Alert>
        )}
        <Stack className={styles['login-stack']}>
          <Heading className={styles['login-title']}>Login</Heading>
          {errorMessage && <Box>{errorMessage}</Box>}
          <form onSubmit={handleSubmit(handleLogin)}>
            <FormControl className={styles['login-form']} isRequired>
              <FormLabel className={styles['login-form-label']}>Email</FormLabel>
              <Input
                type="email"
                id="email"
                placeholder="Enter email"
                {...register('email')}
                isRequired
              />
              <Box className={styles['error-box']}>{errors.email?.message}</Box>
              <FormLabel className={styles['login-form-label']}>Password</FormLabel>
              <Input
                type="password"
                id="password"
                placeholder="Enter password"
                {...register('password')}
                isRequired
              />
              <Box className={styles['error-box']}>{errors.password?.message}</Box>
              <Button colorScheme="blue" className={styles['login-button']} type="submit">
                Sign in
              </Button>
              <Link
                className={styles['forgot-password-link']}
                href="/forgot-password"
                color="teal.500"
              >
                Forgot Password
              </Link>
            </FormControl>
          </form>
        </Stack>
      </Stack>
    </Flex>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);

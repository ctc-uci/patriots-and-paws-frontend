import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { instanceOf } from 'prop-types';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState();

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
  const handleSubmit = async e => {
    try {
      e.preventDefault();
      await logInWithEmailAndPassword(email, password, '/', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
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
          <form onSubmit={handleSubmit}>
            <FormControl className={styles['login-form']} isRequired>
              <FormLabel className={styles['login-form-label']}>Email</FormLabel>
              <Input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                isRequired
              />
              <FormLabel className={styles['login-form-label']}>Password</FormLabel>
              <Input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                isRequired
              />
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

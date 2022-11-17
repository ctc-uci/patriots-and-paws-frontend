import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import styles from './Login.module.css';
import { Cookies, withCookies } from '../../utils/CookieUtils';
import { logInWithEmailAndPassword, useNavigate } from '../../utils/AuthUtils';

const Login = ({ cookies }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState();

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

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack>
        <Heading className={styles['login-title']}>Login</Heading>
        {errorMessage && <p>{errorMessage}</p>}
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
          <Button
            colorScheme="blue"
            className={styles['login-button']}
            onClick={e => {
              handleSubmit(e);
            }}
          >
            Sign in
          </Button>
          <Link className={styles['forgot-password-link']} href="/forgot-password" color="teal.500">
            Forgot Password
          </Link>
        </FormControl>
      </Stack>
    </Flex>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);

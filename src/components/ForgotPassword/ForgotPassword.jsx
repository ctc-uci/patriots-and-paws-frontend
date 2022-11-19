import React, { useState } from 'react';
import {
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Link,
  Box,
} from '@chakra-ui/react';
import { sendPasswordReset } from '../../utils/AuthUtils';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState();
  const handleForgotPassword = async e => {
    try {
      e.preventDefault();
      await sendPasswordReset(email);
      setConfirmationMessage(
        'If the email entered is associated with an account, you should receive an email to reset your password shortly.',
      );
      setErrorMessage('');
      setEmail('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack>
        <Heading className={styles['forgot-password-title']}>Send Reset Email</Heading>
        {errorMessage && <Box>{errorMessage}</Box>}
        <FormControl className={styles['forgot-password-form']} isRequired>
          <FormLabel className={styles['forgot-password-label']}>Email</FormLabel>
          <Input
            type="text"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            placeholder="Email"
          />
          <Button
            colorScheme="blue"
            className={styles['forgot-password-button']}
            onClick={handleForgotPassword}
          >
            Send Email
          </Button>
        </FormControl>
        {confirmationMessage && (
          <Box className={styles['confirmation-msg']}>{confirmationMessage}</Box>
        )}
        <Link className={styles['login-link']} href="/login" color="teal.500">
          Back to Login
        </Link>
      </Stack>
    </Flex>
  );
};

export default ForgotPassword;

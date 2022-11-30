import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Stack,
  Box,
  Link,
} from '@chakra-ui/react';
import { confirmNewPassword } from '../../utils/AuthUtils';
import styles from './ResetPassword.module.css';
import { passwordRequirementsRegex } from '../../utils/utils';

const ResetPassword = ({ code }) => {
  const [password, setPassword] = useState();
  const [checkPassword, setCheckPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState();
  const handleResetPassword = async e => {
    try {
      e.preventDefault();
      if (!passwordRequirementsRegex.test(password)) {
        throw new Error(
          'Password requires at least 8 characters consisting of at least 1 lowercase letter, 1 uppercase letter, and 1 symbol.',
        );
      }

      if (password !== checkPassword) {
        throw new Error("Passwords don't match");
      }

      await confirmNewPassword(code, password);
      setConfirmationMessage('Password changed. You can now sign in with your new password.');
      setErrorMessage('');
      setPassword('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack>
        <Heading className={styles['reset-password-title']}>Reset Password</Heading>
        {confirmationMessage ? (
          <Stack>
            <Box>{confirmationMessage}</Box>
            <Link href="/login" color="teal.500">
              Back to Login
            </Link>
          </Stack>
        ) : (
          <FormControl
            isRequired
            className={styles['reset-password-form']}
            onSubmit={handleResetPassword}
          >
            <FormLabel className={styles['reset-password-label']}>New Password</FormLabel>
            <Input
              type="password"
              onChange={({ target }) => setPassword(target.value)}
              placeholder="New Password"
              isRequired
            />
            <FormLabel className={styles['reset-password-label']}>Re-enter Password</FormLabel>
            <Input
              type="password"
              onChange={({ target }) => setCheckPassword(target.value)}
              placeholder="Re-enter Password"
              isRequired
            />
            {errorMessage && <Box className={styles['error-msg']}>{errorMessage}</Box>}
            <Button
              colorScheme="blue"
              className={styles['reset-password-button']}
              onClick={e => handleResetPassword(e)}
            >
              Reset Password
            </Button>
          </FormControl>
        )}
      </Stack>
    </Flex>
  );
};

ResetPassword.propTypes = {
  code: PropTypes.string.isRequired,
};

export default ResetPassword;

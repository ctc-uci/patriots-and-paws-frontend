import React, { useState, useEffect } from 'react';
import { Flex, Stack, Heading, Box, Link } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { confirmVerifyEmail } from '../../utils/AuthUtils';
import styles from './VerifyEmail.module.css';

const VerifyEmail = ({ code }) => {
  const [errorMessage, setErrorMessage] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState();

  useEffect(async () => {
    try {
      await confirmVerifyEmail(code);
      setConfirmationMessage(
        'Your email has been been verified. You can now sign in with your new account.',
      );
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, []);

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Heading className={styles['verify-email-title']}>Verify Email</Heading>
      {errorMessage && <p>{errorMessage}</p>}
      {confirmationMessage && (
        <Stack>
          <Box>{confirmationMessage}</Box>
          <Link href="/login">Back to Login</Link>
        </Stack>
      )}
    </Flex>
  );
};

VerifyEmail.propTypes = {
  code: PropTypes.string.isRequired,
};

export default VerifyEmail;

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
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { sendPasswordReset } from '../../utils/AuthUtils';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState();

  const formSchema = yup.object({
    email: yup.string().email().required('Please enter your email address'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const handleForgotPassword = async data => {
    try {
      const { email } = data;
      await sendPasswordReset(email);
      setConfirmationMessage(
        'If the email entered is associated with an account, you should receive an email to reset your password shortly.',
      );
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack>
        <Heading className={styles['forgot-password-title']}>Send Reset Email</Heading>
        {errorMessage && <Box>{errorMessage}</Box>}
        <form onSubmit={handleSubmit(handleForgotPassword)}>
          <FormControl className={styles['forgot-password-form']} isRequired>
            <FormLabel className={styles['forgot-password-label']}>Email</FormLabel>
            <Input type="text" placeholder="Email" {...register('email')} isRequired />
            <Box className={styles['error-box']}>{errors.email?.message}</Box>
            <Button colorScheme="blue" className={styles['forgot-password-button']} type="submit">
              Send Email
            </Button>
          </FormControl>
        </form>
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

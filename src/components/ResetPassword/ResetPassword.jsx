import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
  Stack,
  Box,
  Link,
} from '@chakra-ui/react';
import { confirmNewPassword } from '../../utils/AuthUtils';
import styles from './ResetPassword.module.css';
import { passwordRequirementsRegex } from '../../utils/utils';

const ResetPassword = ({ code }) => {
  // const [password, setPassword] = useState();
  // const [checkPassword, setCheckPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState();

  const formSchema = yup.object({
    newPassword: yup
      .string()
      .matches(
        passwordRequirementsRegex,
        'Password requires at least 8 characters consisting of at least 1 lowercase letter, 1 uppercase letter, 1 symbol, and 1 number.',
      )
      .required('Please enter your new password'),
    confirmNewPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('newPassword'), null], 'Passwords must both match'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const handleResetPassword = async e => {
    try {
      const { newPassword, confirmNewPassword: confirmPassword } = e;

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords don't match");
      }

      await confirmNewPassword(code, newPassword);
      setConfirmationMessage('Password changed. You can now sign in with your new password.');
      setErrorMessage('');
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
          <form onSubmit={handleSubmit(handleResetPassword)}>
            <FormControl
              isRequired
              className={styles['reset-password-form']}
              onSubmit={handleResetPassword}
            >
              <FormLabel className={styles['reset-password-label']}>New Password</FormLabel>
              <Input
                type="password"
                placeholder="New Password"
                {...register('newPassword')}
                isRequired
              />
              <Box className={styles['error-box']}>{errors.newPassword?.message}</Box>
              <FormLabel className={styles['reset-password-label']}>Re-enter Password</FormLabel>
              <Input
                type="password"
                {...register('confirmNewPassword')}
                placeholder="Re-enter Password"
                isRequired
              />
              <Box className={styles['error-box']}>{errors.confirmNewPassword?.message}</Box>
              {errorMessage && <Box className={styles['error-msg']}>{errorMessage}</Box>}
              <Button colorScheme="blue" className={styles['reset-password-button']} type="submit">
                Reset Password
              </Button>
            </FormControl>
          </form>
        )}
      </Stack>
    </Flex>
  );
};

ResetPassword.propTypes = {
  code: PropTypes.string.isRequired,
};

export default ResetPassword;

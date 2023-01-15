import React, { useState, useEffect } from 'react';
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
  HStack,
} from '@chakra-ui/react';

import styles from './UserDetails.module.css';
import { passwordRequirementsRegex } from '../../utils/utils';
import { getUserFromDB, updateFirebaseUser } from '../../utils/AuthUtils';

const UserDetails = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' });
  const [canEditForm, setCanEditForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const userFromDB = await getUserFromDB();
      setUser(userFromDB);
    };
    fetchUserFromDB();
  }, []);

  const formSchema = yup.object({
    firstName: yup.string().required('Please enter your first name'),
    lastName: yup.string().required('Please enter your last name'),
    phoneNumber: yup
      .string()
      .length(10, 'Please enter a ten digit phone number')
      .matches(/^\d{10}$/)
      .required('Please enter your phone number'),
    password: yup
      .string()
      .matches(
        passwordRequirementsRegex,
        'Password requires at least 8 characters consisting of at least 1 lowercase letter, 1 uppercase letter, 1 symbol, and 1 number.',
      )
      .required('Please enter your password'),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password'), null], 'Passwords must both match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    },
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const updateUserDetails = async e => {
    try {
      const { firstName, lastName, phoneNumber, password } = e;

      const updatedUser = { firstName, lastName, phoneNumber, password };
      await updateFirebaseUser(updatedUser);
    } catch (err) {
      const firebaseErrorMsg = err.message;
      setErrorMessage(firebaseErrorMsg);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    });
    setCanEditForm(false);
  };

  return (
    <Flex minH="50vh" align="center" justify="center">
      <Stack className={styles['user-details-stack']}>
        <Heading align="center">User Profile</Heading>
        {errorMessage && <Box>{errorMessage}</Box>}
        <form onSubmit={handleSubmit(updateUserDetails)}>
          <FormControl isRequired>
            <FormLabel className={styles['user-details-form-label']}>First Name</FormLabel>
            <Input
              id="first-name"
              placeholder="Enter first name"
              {...register('firstName')}
              isRequired
              isDisabled={!canEditForm}
            />
            <Box className={styles['error-box']}>{errors.firstName?.message}</Box>
            <FormLabel className={styles['user-details-form-label']}>Last Name</FormLabel>
            <Input
              id="last-name"
              placeholder="Enter last name"
              {...register('lastName')}
              isRequired
              isDisabled={!canEditForm}
            />
            <Box className={styles['error-box']}>{errors.lastName?.message}</Box>
            <FormLabel className={styles['user-details-form-label']}>Phone Number</FormLabel>
            <Input
              type="tel"
              id="phone-number"
              placeholder="Enter phone number"
              {...register('phoneNumber')}
              isRequired
              isDisabled={!canEditForm}
            />
            <Box className={styles['error-box']}>{errors.phoneNumber?.message}</Box>
            <FormLabel className={styles['user-details-form-label']}>Email</FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="Enter email"
              value={user.email}
              {...register('email')}
              isRequired
              isDisabled
            />
            <Box className={styles['error-box']}>{errors.email?.message}</Box>
            <FormLabel className={styles['user-details-form-label']}>Password</FormLabel>
            <Input
              type="password"
              id="password"
              placeholder="Enter password"
              {...register('password')}
              isRequired
              isDisabled={!canEditForm}
            />
            <Box className={styles['error-box']}>{errors.password?.message}</Box>
            <FormLabel className={styles['user-details-form-label']}>Re-enter Password</FormLabel>
            <Input
              type="password"
              id="check-password"
              placeholder="Re-enter password"
              {...register('confirmPassword')}
              isRequired
              isDisabled={!canEditForm}
            />
            <Box className={styles['error-box']}>{errors.confirmPassword?.message}</Box>
            {canEditForm ? (
              <HStack className={styles['button-stack']}>
                <Button
                  colorScheme="gray"
                  className={styles['cancel-button']}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button colorScheme="blue" className={styles['save-button']} type="submit">
                  Save
                </Button>
              </HStack>
            ) : (
              <Button
                colorScheme="gray"
                className={styles['edit-button']}
                onClick={() => {
                  setCanEditForm(true);
                }}
              >
                Edit Profile
              </Button>
            )}
          </FormControl>
        </form>
      </Stack>
    </Flex>
  );
};

export default UserDetails;

import React, { useState, useEffect } from 'react';
import PropTypes, { instanceOf } from 'prop-types';
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
import {
  getUserFromDB,
  updateUser,
  logout,
  useNavigate,
  getCurrentUserId,
  getCurrentUserRole,
} from '../../utils/AuthUtils';
import { Cookies, withCookies } from '../../utils/CookieUtils';
import AUTH_ROLES from '../../utils/AuthConfig';

const UserDetails = ({ userId, cookies }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [canEditForm, setCanEditForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const userFromDB = await getUserFromDB(userId);

      const currentUserRole = getCurrentUserRole();
      const currentUserId = getCurrentUserId();

      // Drivers should only be able to access their own profile
      if (currentUserId !== userId) {
        if (
          currentUserRole === DRIVER_ROLE ||
          (currentUserRole === ADMIN_ROLE &&
            [SUPERADMIN_ROLE, ADMIN_ROLE].includes(userFromDB.role))
        ) {
          try {
            await logout('/login', navigate, cookies);
          } catch (err) {
            setErrorMessage(err.message);
          }
        }
      }
      setUser(userFromDB);
    };
    fetchUserFromDB();
  }, []);

  const formSchema = yup.object().shape({
    firstName: yup.string().required('Please enter your first name'),
    lastName: yup.string().required('Please enter your last name'),
    phoneNumber: yup
      .string()
      .length(10, 'Please enter a ten digit phone number')
      .matches(/^\d{10}$/)
      .required('Please enter your phone number'),
    newPassword: yup
      .string()
      .matches(
        passwordRequirementsRegex,
        'Password requires at least 8 characters consisting of at least 1 lowercase letter, 1 uppercase letter, 1 symbol, and 1 number.',
      )
      .optional(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Passwords must both match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: async () => getUserFromDB(userId),
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const updateUserDetails = async e => {
    try {
      const { firstName, lastName, phoneNumber, email, newPassword } = e;

      const updatedUser = { firstName, lastName, phoneNumber, email, newPassword };
      await updateUser(updatedUser, userId);
      reset({
        newPassword: '',
        confirmPassword: '',
      });
      setCanEditForm(false);
      setErrorMessage('');
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
      newPassword: '',
      confirmPassword: '',
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
          </FormControl>
          <FormControl isRequired>
            <FormLabel className={styles['user-details-form-label']}>Last Name</FormLabel>
            <Input
              id="last-name"
              placeholder="Enter last name"
              {...register('lastName')}
              isRequired
              isDisabled={!canEditForm}
            />
            <Box className={styles['error-box']}>{errors.lastName?.message}</Box>
          </FormControl>
          <FormControl isRequired>
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
          </FormControl>
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
          <FormControl isRequired={getValues('newPassword')?.length > 0}>
            <FormLabel className={styles['user-details-form-label']}>New Password</FormLabel>
            <Input
              type="password"
              id="new-password"
              placeholder="Enter new password"
              {...register('newPassword')}
              isRequired={getValues('newPassword')?.length > 0}
              isDisabled={!canEditForm}
            />
            <Box className={styles['error-box']}>{errors.password?.message}</Box>
          </FormControl>
          <FormControl isRequired={getValues('newPassword')?.length > 0}>
            <FormLabel className={styles['user-details-form-label']}>
              Re-enter New Password
            </FormLabel>
            <Input
              type="password"
              id="confirm-password"
              placeholder="Re-enter new password"
              {...register('confirmPassword')}
              isRequired={getValues('newPassword')?.length > 0}
              isDisabled={!canEditForm}
            />
            <Box className={styles['error-box']}>{errors.confirmPassword?.message}</Box>
          </FormControl>
          {canEditForm ? (
            <HStack className={styles['button-stack']}>
              <Button colorScheme="gray" className={styles['cancel-button']} onClick={handleCancel}>
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
        </form>
      </Stack>
    </Flex>
  );
};

UserDetails.propTypes = {
  userId: PropTypes.string.isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(UserDetails);

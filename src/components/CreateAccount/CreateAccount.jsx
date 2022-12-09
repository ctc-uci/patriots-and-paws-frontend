import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  RadioGroup,
  Radio,
} from '@chakra-ui/react';
import { registerWithEmailAndPassword, getUserRole } from '../../utils/AuthUtils';
import styles from './CreateAccount.module.css';
import AUTH_ROLES from '../../utils/AuthConfig';
import { passwordRequirementsRegex } from '../../utils/utils';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const CreateAccount = () => {
  const [role, setRole] = useState(ADMIN_ROLE);
  const formSchema = yup.object({
    firstName: yup.string().required('Please enter your first name'),
    lastName: yup.string().required('Please enter your last name'),
    phoneNumber: yup
      .string()
      .length(10, 'Please enter a ten digit phone number')
      .matches(/^\d{10}$/)
      .required('Please enter your phone number'),
    email: yup.string().email().required('Please enter your email address'),
    password: yup
      .string()
      .matches(
        passwordRequirementsRegex,
        'Password requires at least 8 characters consisting of at least 1 lowercase letter, 1 uppercase letter, 1 symbol, and 1 number.',
      )
      .required('Please enter your password'),
    confirmPassword: yup.string().required('Please re-enter your password'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const [errorMessage, setErrorMessage] = useState();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIsSuperAdmin = async () => {
      const currentUserRole = await getUserRole();
      if (currentUserRole === SUPERADMIN_ROLE) {
        setIsSuperAdmin(true);
      }
    };
    checkIsSuperAdmin();
  }, []);

  const onSubmit = async e => {
    try {
      if (e.password !== e.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const user = {
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        phoneNumber: e.phoneNumber,
        password: e.password,
        role,
      };

      await registerWithEmailAndPassword(user, navigate, '/login?signup=success');
    } catch (err) {
      const errorCode = err.code;
      const firebaseErrorMsg = err.message;

      if (errorCode === 'auth/email-already-in-use') {
        setErrorMessage('This email address is already associated with another account');
      } else {
        setErrorMessage(firebaseErrorMsg);
      }
    }
  };

  /* eslint-disable react/jsx-props-no-spreading */

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack>
        <Heading className={styles['create-account-title']}>Create Account</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isRequired className={styles['create-account-form']}>
            <FormLabel className={styles['create-account-form-label']}>First Name</FormLabel>
            <Input
              id="first-name"
              placeholder="Enter first name"
              {...register('firstName')}
              isRequired
            />
            <Box className={styles['error-box']}>{errors.firstName?.message}</Box>
            <FormLabel className={styles['create-account-form-label']}>Last Name</FormLabel>
            <Input
              id="last-name"
              placeholder="Enter last name"
              {...register('lastName')}
              isRequired
            />
            <Box className={styles['error-box']}>{errors.lastName?.message}</Box>
            <FormLabel className={styles['create-account-form-label']}>Phone Number</FormLabel>
            <Input
              type="tel"
              id="phone-number"
              placeholder="Enter phone number"
              {...register('phoneNumber')}
              isRequired
            />
            <Box className={styles['error-box']}>{errors.phoneNumber?.message}</Box>
            <FormLabel className={styles['create-account-form-label']}>Email</FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="Enter email"
              {...register('email')}
              isRequired
            />
            <Box className={styles['error-box']}>{errors.email?.message}</Box>
            <FormLabel className={styles['create-account-form-label']}>Role</FormLabel>
            <RadioGroup
              onChange={setRole}
              className={styles['role-radio-group']}
              defaultValue={ADMIN_ROLE}
            >
              <Stack direction="row">
                {isSuperAdmin && <Radio value={ADMIN_ROLE}>Admin</Radio>}
                <Radio value={DRIVER_ROLE}>Driver</Radio>
              </Stack>
            </RadioGroup>
            <FormLabel className={styles['create-account-form-label']}>Password</FormLabel>
            <Input
              type="password"
              id="password"
              placeholder="Enter password"
              {...register('password')}
              isRequired
            />
            <Box className={styles['error-box']}>{errors.password?.message}</Box>
            <FormLabel className={styles['create-account-form-label']}>Re-enter Password</FormLabel>
            <Input
              type="password"
              id="check-password"
              placeholder="Re-enter password"
              {...register('confirmPassword')}
              isRequired
            />
            <Button colorScheme="blue" className={styles['create-account-button']} type="submit">
              Create account
            </Button>
          </FormControl>
        </form>
        <Box className={styles['error-box']}>{errorMessage}</Box>
      </Stack>
    </Flex>
  );
};

export default CreateAccount;

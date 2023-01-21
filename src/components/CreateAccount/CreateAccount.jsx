import React, { useEffect, useState } from 'react';
import { PropTypes, instanceOf } from 'prop-types';
// import { useNavigate } from 'react-router-dom';
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
// import { SmallAddIcon } from '@chakra-ui/icons';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import { registerWithEmailAndPassword } from '../../utils/AuthUtils';
import styles from './CreateAccount.module.css';
import AUTH_ROLES from '../../utils/AuthConfig';
import { passwordRequirementsRegex } from '../../utils/utils';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const CreateAccount = ({ cookies, memberType }) => {
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
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password'), null], 'Passwords must both match'),
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
  // const navigate = useNavigate();

  useEffect(() => {
    const checkIsSuperAdmin = () => {
      const currentUserRole = cookies.get(cookieKeys.ROLE);
      setIsSuperAdmin(currentUserRole === SUPERADMIN_ROLE);
    };
    checkIsSuperAdmin();
  }, []);

  const onSubmit = async e => {
    try {
      const { firstName, lastName, email, phoneNumber, password } = e;

      const user = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
      };
      await registerWithEmailAndPassword(user);
      setErrorMessage('User successfully created');
      // await registerWithEmailAndPassword(user, navigate, '/login?signup=success');
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
  // const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex m={5}>
      <Stack>
        <Heading className={styles['create-account-title']}>Add {memberType}</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isRequired className={styles['create-account-form']}>
            <Flex>
              <Flex direction="column" mr={8}>
                <FormLabel className={styles['create-account-form-label']}>First Name</FormLabel>
                <Input
                  id="first-name"
                  style={{ width: '240px' }}
                  placeholder="Enter first name"
                  {...register('firstName')}
                  isRequired
                />
                <Box className={styles['error-box']}>{errors.firstName?.message}</Box>
              </Flex>
              <Flex direction="column">
                <FormLabel className={styles['create-account-form-label']}>Last Name</FormLabel>
                <Input
                  id="last-name"
                  style={{ width: '240px' }}
                  placeholder="Enter last name"
                  {...register('lastName')}
                  isRequired
                />
                <Box className={styles['error-box']}>{errors.lastName?.message}</Box>
              </Flex>
            </Flex>
            <Flex>
              <Flex direction="column" mr={8}>
                <FormLabel className={styles['create-account-form-label']}>Phone Number</FormLabel>
                <Input
                  type="tel"
                  id="phone-number"
                  style={{ width: '240px' }}
                  placeholder="Enter phone number"
                  {...register('phoneNumber')}
                  isRequired
                />
                <Box className={styles['error-box']}>{errors.phoneNumber?.message}</Box>
              </Flex>
              <Flex direction="column">
                <FormLabel className={styles['create-account-form-label']}>Email</FormLabel>
                <Input
                  type="email"
                  id="email"
                  style={{ width: '240px' }}
                  placeholder="Enter email"
                  {...register('email')}
                  isRequired
                />
                <Box className={styles['error-box']}>{errors.email?.message}</Box>
              </Flex>
            </Flex>
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
            <Flex>
              <Flex direction="column" mr={8}>
                <FormLabel className={styles['create-account-form-label']}>Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  style={{ width: '240px' }}
                  placeholder="Enter password"
                  {...register('password')}
                  isRequired
                />
                <Box className={styles['error-box']}>{errors.password?.message}</Box>
              </Flex>
              <Flex direction="column">
                <FormLabel className={styles['create-account-form-label']}>
                  Re-enter Password
                </FormLabel>
                <Input
                  type="password"
                  id="check-password"
                  style={{ width: '240px' }}
                  placeholder="Re-enter password"
                  {...register('confirmPassword')}
                  isRequired
                />
                <Box className={styles['error-box']}>{errors.confirmPassword?.message}</Box>
              </Flex>
            </Flex>
            <Flex>
              <Button colorScheme="gray" className={styles['create-account-button']} type="submit">
                Cancel
              </Button>
              <Button colorScheme="blue" className={styles['create-account-button']} type="submit">
                Add Driver
              </Button>
            </Flex>
          </FormControl>
        </form>
        <Box className={styles['error-box']}>{errorMessage}</Box>
      </Stack>
    </Flex>
  );
};

CreateAccount.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
  memberType: PropTypes.string.isRequired,
};

export default withCookies(CreateAccount);

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { registerWithEmailAndPassword } from '../../utils/AuthUtils';
import styles from './Register.module.css';
import AUTH_ROLES from '../../utils/AuthConfig';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [role, setRole] = useState(ADMIN_ROLE);
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // At least 1 lowercase, 1 uppercase, 1 symbol, 8 characters
      const passwordRequirementsRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{8,}$/;

      if (!passwordRequirementsRegex.test(password)) {
        throw new Error(
          'Password requires at least 8 characters consisting of at least 1 lowercase letter, 1 uppercase letter, and 1 symbol.',
        );
      }

      if (password !== checkPassword) {
        throw new Error("Passwords don't match");
      }

      const user = { firstName, lastName, email, phoneNumber, password, role };

      await registerWithEmailAndPassword(user, navigate, '/login?signup=success');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack>
        <Heading className={styles['register-title']}>Register</Heading>
        <FormControl isRequired className={styles['register-form']}>
          <FormLabel className={styles['register-form-label']}>First Name</FormLabel>
          <Input
            id="first-name"
            placeholder="Enter first name"
            value={firstName}
            onChange={({ target }) => setFirstName(target.value)}
            isRequired
          />
          <FormLabel className={styles['register-form-label']}>Last Name</FormLabel>
          <Input
            id="last-name"
            placeholder="Enter last name"
            value={lastName}
            onChange={({ target }) => setLastName(target.value)}
            isRequired
          />
          <FormLabel className={styles['register-form-label']}>Phone Number</FormLabel>
          <Input
            type="tel"
            id="phone-number"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={({ target }) => setPhoneNumber(target.value)}
            isRequired
          />
          <FormLabel className={styles['register-form-label']}>Email</FormLabel>
          <Input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            isRequired
          />
          <FormLabel className={styles['register-form-label']}>Role</FormLabel>
          <RadioGroup
            onChange={setRole}
            className={styles['role-radio-group']}
            defaultValue={ADMIN_ROLE}
          >
            <Stack direction="row">
              <Radio value={SUPERADMIN_ROLE}>Superadmin</Radio>
              <Radio value={ADMIN_ROLE}>Admin</Radio>
              <Radio value={DRIVER_ROLE}>Driver</Radio>
            </Stack>
          </RadioGroup>
          <FormLabel className={styles['register-form-label']}>Password</FormLabel>
          <Input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            isRequired
          />
          <FormLabel className={styles['register-form-label']}>Re-enter Password</FormLabel>
          <Input
            type="password"
            id="check-password"
            placeholder="Re-enter password"
            value={checkPassword}
            onChange={({ target }) => setCheckPassword(target.value)}
            isRequired
          />
          <Button
            colorScheme="blue"
            className={styles['register-button']}
            onClick={e => {
              handleSubmit(e);
            }}
          >
            Register
          </Button>
        </FormControl>
        <Box className={styles['error-box']}>{errorMessage}</Box>
      </Stack>
    </Flex>
  );
};

export default Register;

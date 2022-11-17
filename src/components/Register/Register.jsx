import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, FormControl, FormLabel, Input, Button, Heading, Stack, Box } from '@chakra-ui/react';
import { registerWithEmailAndPassword } from '../../utils/AuthUtils';
import styles from './Register.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [role, setRole] = useState('');
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

      await registerWithEmailAndPassword(email, password, role, navigate, '/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack align="center">
        <Heading className={styles['register-title']}>Register</Heading>
        <FormControl isRequired className={styles['register-form']}>
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
          <Input
            type="text"
            id="role"
            placeholder="Enter role"
            value={role}
            onChange={({ target }) => setRole(target.value)}
            isRequired
          />
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

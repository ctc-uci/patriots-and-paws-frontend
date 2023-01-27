import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
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
  Modal,
  ModalContent,
  ModalOverlay,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import { registerWithEmailAndPassword } from '../../utils/AuthUtils';
import styles from './CreateAccount.module.css';
import { passwordRequirementsRegex } from '../../utils/utils';

const CreateAccount = ({ isSuperAdmin, refreshData }) => {
  const formSchema = yup.object({
    firstName: yup.string().required("Please enter the staff member's first name"),
    lastName: yup.string().required("Please enter the staff member's last name"),
    phoneNumber: yup
      .string()
      .length(10, 'Please enter a ten digit phone number')
      .matches(/^\d{10}$/)
      .required("Please enter the staff member's phone number"),
    email: yup.string().email().required("Please enter the staff member's email address"),
    password: yup
      .string()
      .matches(
        passwordRequirementsRegex,
        'Password requires at least 8 characters consisting of at least 1 lowercase letter, 1 uppercase letter, 1 symbol, and 1 number.',
      )
      .required("Please enter the staff member's password"),
    confirmPassword: yup
      .string()
      .required("Please confirm the staff member's password")
      .oneOf([yup.ref('password'), null], 'Passwords must both match'),
    role: yup.string().required("Please select the staff member's role"),
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

  const onSubmit = async e => {
    try {
      const { firstName, lastName, email, phoneNumber, password, role } = e;

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
      refreshData();
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        ml={5}
        mt={0}
        colorScheme="blue"
        className={styles['create-account-button']}
        onClick={onOpen}
      >
        Add Staff <SmallAddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Flex m={5}>
            <Stack>
              <Heading className={styles['create-account-title']}>Add Staff</Heading>
              <form>
                <FormControl className={styles['create-account-form']}>
                  <Flex>
                    <Flex direction="column" mr={8}>
                      <FormLabel className={styles['create-account-form-label']}>
                        First Name
                      </FormLabel>
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
                      <FormLabel className={styles['create-account-form-label']}>
                        Last Name
                      </FormLabel>
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
                    <Flex direction="column">
                      <FormLabel className={styles['create-account-form-label']}>
                        Phone Number
                      </FormLabel>
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
                  </Flex>
                  <Flex>
                    <Flex direction="column" mr={8}>
                      <FormLabel className={styles['create-account-form-label']}>
                        Password
                      </FormLabel>
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
                  {isSuperAdmin ? (
                    <Flex>
                      <Flex direction="column">
                        <FormLabel className={styles['create-account-form-label']}>Role</FormLabel>
                        <Select style={{ width: '240px' }} {...register('role')} isRequired>
                          <option value="admin" selected>
                            Admin
                          </option>
                          <option value="driver">Driver</option>
                        </Select>
                      </Flex>
                    </Flex>
                  ) : null}
                </FormControl>
              </form>
              <Box className={styles['error-box']}>{errorMessage}</Box>
            </Stack>
          </Flex>
          <ModalFooter>
            <Flex justify="flex-end">
              <Button
                colorScheme="gray"
                className={styles['create-account-button']}
                type="submit"
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                className={styles['create-account-button']}
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Add Staff
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

CreateAccount.propTypes = {
  isSuperAdmin: PropTypes.bool.isRequired,
  refreshData: PropTypes.func.isRequired,
};

export default CreateAccount;

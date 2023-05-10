import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Text,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { SmallAddIcon, InfoIcon } from '@chakra-ui/icons';
import { registerWithEmailAndPassword } from '../../utils/AuthUtils';
import styles from './CreateAccount.module.css';
import { passwordRequirementsRegex } from '../../utils/utils';

const CreateAccount = ({ isSuperAdmin, setAllUsers, setDriverUsers, setAdminUsers }) => {
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
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const [errorMessage, setErrorMessage] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async e => {
    const { firstName, lastName, email, phoneNumber, password, role } = e;

    const user = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
    };
    try {
      await registerWithEmailAndPassword(user);
      setErrorMessage('User successfully created');
      setAllUsers(prev => prev.concat(user));
      if (role === 'admin') {
        setAdminUsers(prev => prev.concat(user));
      } else {
        setDriverUsers(prev => prev.concat(user));
      }
      onClose();
      reset();
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

  const resetFields = () => {
    reset();
    onClose();
  };

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
      <Modal isOpen={isOpen} onClose={resetFields} size={{ base: 'lg', md: 'xl' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Flex m={5} justifyContent={{ base: 'center', md: 'start' }}>
            <Stack>
              <Heading className={styles['create-account-title']}>Add Staff</Heading>
              <form>
                <FormControl className={styles['create-account-form']}>
                  <Box display={{ md: 'flex' }}>
                    <Flex direction="column" mr={8}>
                      <FormControl isInvalid={errors && errors.firstName}>
                        <FormLabel className={styles['create-account-form-label']}>
                          First Name
                        </FormLabel>
                        <Input
                          id="add-staff"
                          style={{ width: '240px' }}
                          placeholder="Enter first name"
                          {...register('firstName')}
                        />
                        <FormErrorMessage>
                          {errors.firstName && errors.firstName.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors && errors.email}>
                        <FormLabel className={styles['create-account-form-label']}>Email</FormLabel>
                        <Input
                          type="email"
                          id="email"
                          style={{ width: '240px' }}
                          placeholder="Enter email"
                          {...register('email')}
                          isRequired
                        />
                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors && errors.password}>
                        <FormLabel className={styles['create-account-form-label']}>
                          Password
                          <Popover placement="top" arrowPadding={8}>
                            <PopoverTrigger>
                              <InfoIcon mb={0.5} ml={2} />
                            </PopoverTrigger>
                            <PopoverContent
                              borderColor="black"
                              bgColor="black"
                              color="white"
                              w={200}
                            >
                              <PopoverArrow borderColor="black" bgColor="black" />
                              <PopoverBody w={200}>
                                <Text textAlign="center" fontSize={16} fontWeight={400}>
                                  Password must contain:
                                </Text>
                                <UnorderedList
                                  listStylePosition="inside"
                                  fontSize={16}
                                  fontWeight={400}
                                >
                                  <ListItem>8 characters</ListItem>
                                  <ListItem>1 lowercase letter</ListItem>
                                  <ListItem>1 uppercase letter</ListItem>
                                  <ListItem>1 symbol</ListItem>
                                </UnorderedList>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </FormLabel>
                        <Input
                          type="password"
                          style={{ width: '240px' }}
                          placeholder="Enter password"
                          {...register('password')}
                          isRequired
                        />
                        <FormErrorMessage>
                          {errors.password && errors.password.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>
                    <Flex direction="column">
                      <FormControl isInvalid={errors && errors.lastName}>
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
                        <FormErrorMessage>
                          {errors.lastName && errors.lastName.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors && errors.phoneNumber}>
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
                        <FormErrorMessage>
                          {errors.phoneNumber && errors.phoneNumber.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors && errors.confirmPassword}>
                        <FormLabel className={styles['create-account-form-label']}>
                          Re-enter Password
                        </FormLabel>
                        <Input
                          type="password"
                          style={{ width: '240px' }}
                          placeholder="Re-enter password"
                          {...register('confirmPassword')}
                          isRequired
                        />
                        <FormErrorMessage>
                          {errors.confirmPassword && errors.confirmPassword.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>
                  </Box>
                  {isSuperAdmin && (
                    <Flex>
                      <Flex direction="column">
                        <FormControl isInvalid={errors && errors.role}>
                          <FormLabel className={styles['create-account-form-label']}>
                            Role
                          </FormLabel>
                          <Select
                            style={{ width: '240px' }}
                            {...register('role')}
                            defaultValue="admin"
                          >
                            <option value="admin">Admin</option>
                            <option value="driver">Driver</option>
                          </Select>
                          <FormErrorMessage>{errors.role && errors.role.message}</FormErrorMessage>
                        </FormControl>
                      </Flex>
                    </Flex>
                  )}
                </FormControl>
              </form>
              <Box className={styles['error-box']}>{errorMessage}</Box>
            </Stack>
          </Flex>
          <Flex justifyContent={{ base: 'center', md: 'none' }}>
            <Button
              colorScheme="blue"
              className={styles['create-account-button']}
              type="submit"
              onClick={handleSubmit(onSubmit)}
              width="50%"
              display={{ md: 'none' }}
            >
              Add Staff
            </Button>
          </Flex>
          <Flex justifyContent={{ base: 'center', md: 'none' }} mb="5">
            <Button
              colorScheme="gray"
              className={styles['create-account-button']}
              type="submit"
              onClick={resetFields}
              width="50%"
              display={{ base: 'block', md: 'none' }}
            >
              Cancel
            </Button>
          </Flex>
          <ModalFooter display={{ base: 'none', md: 'block' }}>
            <Flex justify="flex-end">
              <Button
                colorScheme="gray"
                className={styles['create-account-button']}
                type="submit"
                mr={3}
                onClick={resetFields}
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
  setAllUsers: PropTypes.func.isRequired,
  setDriverUsers: PropTypes.func.isRequired,
  setAdminUsers: PropTypes.func.isRequired,
};

export default CreateAccount;

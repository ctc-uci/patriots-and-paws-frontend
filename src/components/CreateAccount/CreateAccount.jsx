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
  Stack,
  Box,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
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
  useToast,
} from '@chakra-ui/react';
import { SmallAddIcon, InfoIcon } from '@chakra-ui/icons';
import { registerWithEmailAndPassword } from '../../utils/AuthUtils';
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
  const toast = useToast();

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
      const uid = await registerWithEmailAndPassword(user);
      const updatedUser = { ...user, id: uid };
      setAllUsers(prev => prev.concat(updatedUser));
      if (role === 'admin') {
        setAdminUsers(prev => prev.concat(updatedUser));
      } else {
        setDriverUsers(prev => prev.concat(updatedUser));
      }

      toast.closeAll();
      toast({
        title: 'New Staff Member Added',
        // description: 'An email has been sent with your donation ID',
        status: 'success',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      });

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
        p="10px 24px 10px 24px"
        gap="8px"
        colorScheme="blue"
        bg="blue.600"
        fontSize="16px"
        fontWeight={600}
        lineHeight="28px"
        height="48px"
        onClick={onOpen}
      >
        Add Staff <SmallAddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={resetFields} size={{ base: 'lg', md: '4xl' }}>
        <ModalOverlay />
        <ModalContent>
          <Flex p="30px 60px 0px 60px" justifyContent={{ base: 'center', md: 'start' }}>
            <Stack>
              <ModalHeader fontSize="36px" fontWeight={700}>
                Add Staff
              </ModalHeader>
              <ModalCloseButton size="lg" right="50px" top="30px" />
              <ModalBody>
                <form>
                  <Flex mb="40px" gap="60px">
                    <Flex flexDir="column">
                      <FormControl isInvalid={errors && errors.firstName}>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          id="add-staff"
                          placeholder="Enter first name"
                          w="320px"
                          {...register('firstName')}
                          maxLength="256"
                          textOverflow="ellipsis"
                        />
                        <FormErrorMessage>
                          {errors.firstName && errors.firstName.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors && errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          id="email"
                          placeholder="Enter email"
                          w="320px"
                          {...register('email')}
                          maxLength="256"
                          textOverflow="ellipsis"
                          isRequired
                        />
                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors && errors.password}>
                        <FormLabel>
                          Password
                          <Popover placement="top" arrowPadding={8}>
                            <PopoverTrigger>
                              <InfoIcon mb={0.5} ml={2} />
                            </PopoverTrigger>
                            <PopoverContent
                              borderColor="black"
                              bgColor="black"
                              color="white"
                              w={206}
                            >
                              <PopoverArrow borderColor="black" bgColor="black" />
                              <PopoverBody>
                                <Text fontSize={16} fontWeight={400}>
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
                          placeholder="Enter password"
                          w="320px"
                          {...register('password')}
                          textOverflow="ellipsis"
                          isRequired
                        />
                        <FormErrorMessage maxWidth="320px">
                          {errors.password && errors.password.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>
                    <Flex direction="column">
                      <FormControl isInvalid={errors && errors.lastName}>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          id="last-name"
                          style={{ width: '240px' }}
                          placeholder="Enter last name"
                          {...register('lastName')}
                          maxLength="256"
                          textOverflow="ellipsis"
                          isRequired
                        />
                        <FormErrorMessage>
                          {errors.lastName && errors.lastName.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors && errors.phoneNumber}>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          type="tel"
                          id="phone-number"
                          style={{ width: '240px' }}
                          placeholder="Enter phone number"
                          {...register('phoneNumber')}
                          maxLength="15"
                          textOverflow="ellipsis"
                          isRequired
                        />
                        <FormErrorMessage>
                          {errors.phoneNumber && errors.phoneNumber.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors && errors.confirmPassword}>
                        <FormLabel>Re-enter Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Re-enter password"
                          w="320px"
                          {...register('confirmPassword')}
                          textOverflow="ellipsis"
                          isRequired
                        />
                        <FormErrorMessage>
                          {errors.confirmPassword && errors.confirmPassword.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>
                  </Flex>
                  {isSuperAdmin ? (
                    <Flex flexDir="row" pb="60px" justifyContent="space-between">
                      <Flex direction="column">
                        <FormControl isInvalid={errors && errors.role}>
                          <FormLabel>Role</FormLabel>
                          <Select {...register('role')} defaultValue="" w="320px">
                            <option value="" disabled>
                              Select Role
                            </option>
                            <option value="admin">Admin</option>
                            <option value="driver">Driver</option>
                          </Select>
                          <FormErrorMessage>{errors.role && errors.role.message}</FormErrorMessage>
                        </FormControl>
                      </Flex>
                      <ModalFooter pr={0} pb={0}>
                        <Flex columnGap="8px" w="100%">
                          <Button
                            variant="ghost"
                            type="submit"
                            fontSize="18px"
                            p="10px 24px"
                            lineHeight="28px"
                            fontWeight={600}
                            height="48px"
                            onClick={resetFields}
                          >
                            Cancel
                          </Button>
                          <Button
                            fontSize="18px"
                            colorScheme="blue"
                            p="10px 24px"
                            lineHeight="28px"
                            fontWeight={600}
                            height="48px"
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                          >
                            Add Staff
                          </Button>
                        </Flex>
                      </ModalFooter>
                    </Flex>
                  ) : (
                    <ModalFooter p="0px 0px 60px 60px">
                      <Flex justify="flex-end" columnGap="8px" w="100%">
                        <Button
                          variant="ghost"
                          type="submit"
                          fontSize="18px"
                          p="10px 24px"
                          lineHeight="28px"
                          fontWeight={600}
                          height="48px"
                          onClick={resetFields}
                        >
                          Cancel
                        </Button>
                        <Button
                          fontSize="18px"
                          colorScheme="blue"
                          p="10px 24px"
                          lineHeight="28px"
                          fontWeight={600}
                          height="48px"
                          type="submit"
                          onClick={handleSubmit(onSubmit)}
                        >
                          Add Staff
                        </Button>
                      </Flex>
                    </ModalFooter>
                  )}
                </form>
                <Box>{errorMessage}</Box>
              </ModalBody>
            </Stack>
          </Flex>
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

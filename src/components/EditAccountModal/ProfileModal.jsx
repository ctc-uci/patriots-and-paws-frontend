/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Button,
  Heading,
  Stack,
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalFooter,
  ModalCloseButton,
  InputRightElement,
  InputGroup,
  IconButton,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { RiLockFill } from 'react-icons/ri';
import { MdEmail, MdPhone, MdInfo } from 'react-icons/md';
import { IoPersonSharp } from 'react-icons/io5';
import { updateUser, logInCurrentUserWithPassword } from '../../utils/AuthUtils';
import { passwordRequirementsRegex } from '../../utils/utils';

const ProfileModal = ({ data, setData, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: data,
    resolver: yupResolver(
      yup.object({
        firstName: yup.string().required("Please enter the staff member's first name"),
        lastName: yup.string().required("Please enter the staff member's last name"),
        phoneNumber: yup
          .string()
          .length(10, 'Please enter a ten digit phone number')
          .matches(/^\d{10}$/)
          .required("Please enter the staff member's phone number"),
        newPassword: yup
          .string()
          .nullable()
          .transform(value => value || null)
          .matches(
            passwordRequirementsRegex,
            'Password requires at least 8 characters consisting of at least 1 lowercase letter, 1 uppercase letter, 1 symbol, and 1 number.',
          ),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('newPassword'), null, ''], 'Passwords must both match'),
      }),
    ),
    delayError: 750,
  });

  useEffect(() => console.log(data), [data]);

  const [isEditable, setIsEditable] = useState(false);

  const toast = useToast();

  const closeModals = () => {
    setIsEditable(false);
    onClose();
  };

  const cancel = () => {
    reset(data);
    setIsEditable(false);
  };

  useEffect(() => {
    // console.log(errors);
    if (Object.keys(errors).length) {
      toast({
        title: "Your changes couldn't be saved!",
        description: 'Error in one or more field(s) are marked in red.',
        status: 'error',
        isClosable: true,
        variant: 'subtle',
        position: 'top',
        duration: 3000,
      });
    }
  }, [errors]);

  const onSubmit = async ({ firstName, lastName, phoneNumber, newPassword }) => {
    const updatedUser = { firstName, lastName, phoneNumber };
    if (newPassword) {
      updatedUser.newPassword = newPassword;
    }

    await updateUser(updatedUser, data.id);

    if (newPassword) {
      await logInCurrentUserWithPassword(newPassword);
    }
    reset({
      newPassword: '',
      confirmPassword: '',
    });
    toast({
      title: 'Your changes have been saved.',
      status: 'success',
      isClosable: true,
      variant: 'subtle',
      position: 'top',
      duration: 3000,
    });
    setData(prev => ({ ...prev, ...updatedUser }));
    closeModals();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onCloseComplete={cancel} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <Flex m={5} justifyContent="center">
          <Stack>
            <Flex justifyContent="space-between">
              <Heading size="lg" mt=".4rem" mb={5}>
                Profile
              </Heading>
              <ModalCloseButton onClick={cancel} mt="1rem" mr="1rem" size="lg" />
            </Flex>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <Flex mb={5}>
                  <Flex direction="column" mr={8}>
                    <FormLabel>First Name</FormLabel>
                    <InputGroup>
                      <InputRightElement pointerEvents="none">
                        <IoPersonSharp color="black.300" />
                      </InputRightElement>
                      <Input
                        id="first-name"
                        style={{ width: '240px' }}
                        errorBorderColor="red.300"
                        isInvalid={'firstName' in errors}
                        isReadOnly={!isEditable}
                        cursor={!isEditable && 'not-allowed'}
                        {...register('firstName')}
                        isRequired
                      />
                    </InputGroup>
                  </Flex>
                  <Flex direction="column">
                    <FormLabel>Last Name</FormLabel>
                    <InputGroup>
                      <InputRightElement pointerEvents="none">
                        <IoPersonSharp color="black.300" />
                      </InputRightElement>
                      <Input
                        id="last-name"
                        style={{ width: '240px' }}
                        errorBorderColor="red.300"
                        isInvalid={'lastName' in errors}
                        isReadOnly={!isEditable}
                        cursor={!isEditable && 'not-allowed'}
                        {...register('lastName')}
                        isRequired
                      />
                    </InputGroup>
                  </Flex>
                </Flex>
                <Flex mb={5}>
                  <Flex direction="column" mr={8}>
                    <FormLabel>Email</FormLabel>
                    <InputGroup>
                      <InputRightElement pointerEvents="none">
                        <MdEmail color="black.300" />
                      </InputRightElement>
                      <Input
                        type="email"
                        id="email"
                        style={{ width: '240px' }}
                        placeholder="Enter email"
                        value={data.email}
                        cursor="not-allowed"
                        isRequired
                        isReadOnly
                      />
                    </InputGroup>
                    <Box>{errors.email?.message}</Box>
                  </Flex>
                  <Flex direction="column">
                    <FormLabel>Phone Number</FormLabel>
                    <InputGroup>
                      <InputRightElement pointerEvents="none">
                        <MdPhone color="black.300" />
                      </InputRightElement>
                      <Input
                        type="tel"
                        id="phone-number"
                        style={{ width: '240px' }}
                        errorBorderColor="red.300"
                        isInvalid={'phoneNumber' in errors}
                        isReadOnly={!isEditable}
                        cursor={!isEditable && 'not-allowed'}
                        {...register('phoneNumber')}
                        isRequired
                      />
                    </InputGroup>
                  </Flex>
                </Flex>
                <Flex mb={5}>
                  <Flex direction="column" mr={8}>
                    {isEditable ? (
                      <Flex>
                        <FormLabel mt=".4rem">Password</FormLabel>
                        <Popover>
                          <PopoverTrigger>
                            <IconButton variant="invisible" icon={<MdInfo color="black.300" />} />
                          </PopoverTrigger>
                          <PopoverContent color="white" bg="black">
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                              Password must contain:
                              <UnorderedList>
                                <ListItem>8 characters</ListItem>
                                <ListItem>1 lowercase letter</ListItem>
                                <ListItem>1 uppercase letter</ListItem>
                                <ListItem>1 symbol</ListItem>
                              </UnorderedList>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                    ) : (
                      <Flex>
                        <FormLabel mt=".4rem">Password</FormLabel>
                        <IconButton
                          variant="invisible"
                          icon={<MdInfo color="black.300" />}
                          visibility="hidden"
                        />
                      </Flex>
                    )}
                    <InputGroup>
                      <InputRightElement pointerEvents="none">
                        <RiLockFill color="black.300" />
                      </InputRightElement>
                      <Input
                        background={!isEditable ? '#EDF2F7' : 'white'}
                        type="password"
                        id="password"
                        style={{ width: '240px' }}
                        placeholder={isEditable && 'Enter password'}
                        errorBorderColor="red.300"
                        isInvalid={'newPassword' in errors}
                        isDisabled={!isEditable}
                        {...register('newPassword')}
                        isRequired
                      />
                    </InputGroup>
                  </Flex>
                  {isEditable && (
                    <Flex direction="column" mt=".46rem">
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        type="password"
                        id="check-password"
                        style={{ width: '240px' }}
                        placeholder="Re-enter password"
                        errorBorderColor="red.300"
                        isInvalid={'confirmPassword' in errors}
                        {...register('confirmPassword')}
                        isRequired
                      />
                      <Box>
                        <Text color="red">{errors.confirmPassword?.message}</Text>
                      </Box>
                    </Flex>
                  )}
                </Flex>
              </FormControl>
            </form>
          </Stack>
        </Flex>
        <ModalFooter>
          <Flex justify="flex-end">
            {isEditable ? (
              <>
                <Button variant="outline" type="submit" mr={3} onClick={cancel}>
                  Cancel
                </Button>
                <Button colorScheme="blue" type="submit" onClick={handleSubmit(onSubmit)}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                color="white"
                background="#718096"
                _hover={{ bg: '#718096' }}
                _focus={{ bg: '#718096' }}
                onClick={() => {
                  setIsEditable(true);
                }}
              >
                Edit Profile
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ProfileModal.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
};

export default ProfileModal;

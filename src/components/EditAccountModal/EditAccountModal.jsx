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
  useDisclosure,
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
import { updateUser } from '../../utils/AuthUtils';
import { passwordRequirementsRegex } from '../../utils/utils';
import styles from './EditAccountModal.module.css';

const superAdminFormSchema = yup.object({
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
});
const defaultFormSchema = yup.object({
  firstName: yup.string().required("Please enter the staff member's first name"),
  lastName: yup.string().required("Please enter the staff member's last name"),
  phoneNumber: yup
    .string()
    .length(10, 'Please enter a ten digit phone number')
    .matches(/^\d{10}$/),
});

const EditAccountModal = ({
  data,
  isSuperAdmin,
  isOpen,
  onClose,
  setUsers,
  setAdminUsers,
  setDriverUsers,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: data,
    resolver: yupResolver(isSuperAdmin ? superAdminFormSchema : defaultFormSchema),
    delayError: 750,
  });

  // const [errorMessage, setErrorMessage] = useState();
  const [viewState, setViewState] = useState('view'); // view / edit
  const originalData = { ...data };

  const { onClose: saveOnClose } = useDisclosure();

  const toast = useToast();

  const closeModals = () => {
    setViewState('view');
    saveOnClose();
    onClose();
  };

  const cancel = () => {
    reset(originalData);
    setViewState('view');
    saveOnClose();
    onClose();
  };

  useEffect(() => {
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

  // useEffect(() => {
  //   console.log(viewState);
  //   let testvar = viewState === 'view' ? false : true;
  //   if (testvar) {
  //     console.log('edit mode');
  //   }
  // }, [viewState]);

  const onSubmit = async e => {
    try {
      const { firstName, lastName, phoneNumber, newPassword } = e;
      const updatedUser = { firstName, lastName, phoneNumber };
      if (newPassword) {
        updatedUser.newPassword = newPassword;
      }

      await updateUser(updatedUser, data.id);
      reset({
        newPassword: '',
        confirmPassword: '',
      });
      // setErrorMessage('User successfully edited');
      if (setUsers) {
        setUsers(prev => prev.map(user => (user.id === data.id ? { ...updatedUser, ...e } : user)));
        if (data.role === 'admin') {
          setAdminUsers(prev =>
            prev.map(user => (user.id === data.id ? { ...updatedUser, ...e } : user)),
          );
        } else {
          setDriverUsers(prev =>
            prev.map(user => (user.id === data.id ? { ...updatedUser, ...e } : user)),
          );
        }
      }
      toast({
        title: 'Your changes have been saved.',
        status: 'success',
        isClosable: true,
        variant: 'subtle',
        position: 'top',
        duration: 3000,
      });
      closeModals();
    } catch (err) {
      // const firebaseErrorMsg = err.message;
      // setErrorMessage(firebaseErrorMsg);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} onCloseComplete={cancel} size="xl">
        <ModalOverlay />
        <ModalContent>
          <Flex m={5}>
            <Stack>
              <Flex justifyContent="space-between">
                <Heading className={styles['create-account-title']} size="lg" mt=".4rem" mb={5}>
                  Profile
                </Heading>
                {/* <IconButton
                  variant="solid"
                  icon={<CloseIcon />}
                  colorScheme="gray"
                  onClick={cancel}
                /> */}
                <ModalCloseButton onClick={cancel} mt="1rem" mr="1rem" size="lg" />
              </Flex>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl className={styles['create-account-form']}>
                  <Flex mb={5}>
                    <Flex direction="column" mr={8}>
                      <FormLabel className={styles['create-account-form-label']}>
                        First Name
                      </FormLabel>
                      <InputGroup>
                        <InputRightElement pointerEvents="none">
                          <IoPersonSharp color="black.300" />
                        </InputRightElement>
                        <Input
                          id="first-name"
                          style={{ width: '240px' }}
                          errorBorderColor="red.300"
                          isInvalid={'firstName' in errors}
                          isDisabled={viewState === 'view'}
                          {...register('firstName')}
                          isRequired
                        />
                      </InputGroup>
                      {/* <Box className={styles['error-box']}>
                        <Text color="red">{errors.firstName?.message}</Text>
                      </Box> */}
                    </Flex>
                    <Flex direction="column">
                      <FormLabel className={styles['create-account-form-label']}>
                        Last Name
                      </FormLabel>
                      <InputGroup>
                        <InputRightElement pointerEvents="none">
                          <IoPersonSharp color="black.300" />
                        </InputRightElement>
                        <Input
                          id="last-name"
                          style={{ width: '240px' }}
                          errorBorderColor="red.300"
                          isInvalid={'lastName' in errors}
                          isDisabled={viewState === 'view'}
                          {...register('lastName')}
                          isRequired
                        />
                      </InputGroup>
                      {/* <Box className={styles['error-box']}>
                        <Text color="red">{errors.lastName?.message}</Text>
                      </Box> */}
                    </Flex>
                  </Flex>
                  <Flex mb={5}>
                    <Flex direction="column" mr={8}>
                      <FormLabel className={styles['create-account-form-label']}>Email</FormLabel>
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
                          isDisabled={viewState === 'view'}
                          isRequired
                          isReadOnly
                        />
                      </InputGroup>
                      <Box className={styles['error-box']}>{errors.email?.message}</Box>
                    </Flex>
                    <Flex direction="column">
                      <FormLabel className={styles['create-account-form-label']}>
                        Phone Number
                      </FormLabel>
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
                          isDisabled={viewState === 'view'}
                          {...register('phoneNumber')}
                          isRequired
                        />
                      </InputGroup>
                      {/* <Box className={styles['error-box']}>
                        <Text color="red">{errors.phoneNumber?.message}</Text>
                      </Box> */}
                    </Flex>
                  </Flex>
                  {isSuperAdmin && (
                    <Flex mb={5}>
                      <Flex direction="column" mr={8}>
                        {/* {viewState === 'edit' && (
                          <HStack>
                            <FormLabel className={styles['create-account-form-label']}>
                              Password
                            </FormLabel>
                            <IconButton
                              icon={<MdInfo color="black.300" pb="2000rem" />}
                              onClick={() => {
                                console.log('clicked icon');
                              }}
                            />
                          </HStack>
                        )} */}
                        {viewState === 'edit' && (
                          <Flex>
                            {' '}
                            <FormLabel className={styles['create-account-form-label']} mt=".4rem">
                              Password
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger>
                                <IconButton
                                  variant="invisible"
                                  icon={<MdInfo color="black.300" />}
                                />
                              </PopoverTrigger>
                              <PopoverContent color="white" bg="black">
                                <PopoverArrow />
                                <PopoverCloseButton />
                                {/* <PopoverHeader>Confirmation!</PopoverHeader> */}
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
                            {/* <IconButton
                              variant="invisible"
                              icon={<MdInfo color="black.300" />}
                              onClick={() => {
                                console.log('clicked icon');
                              }}
                            /> */}
                          </Flex>
                        )}
                        {viewState === 'view' && (
                          <FormLabel className={styles['create-account-form-label']}>
                            Password
                          </FormLabel>
                        )}
                        <InputGroup>
                          <InputRightElement pointerEvents="none">
                            <RiLockFill color="black.300" />
                          </InputRightElement>
                          <Input
                            background={viewState === 'view' ? '#A0AEC0' : 'white'}
                            type="password"
                            id="password"
                            style={{ width: '240px' }}
                            placeholder="Enter password"
                            errorBorderColor="red.300"
                            isInvalid={'newPassword' in errors}
                            isDisabled={viewState === 'view'}
                            {...register('newPassword')}
                            isRequired
                          />
                        </InputGroup>
                        {/* <Box className={styles['error-box']}>
                          <Text color="red">{errors.newPassword?.message}</Text>
                        </Box> */}
                      </Flex>
                      {viewState === 'edit' && (
                        <Flex direction="column" mt=".46rem">
                          <FormLabel className={styles['create-account-form-label']}>
                            Confirm Password
                          </FormLabel>
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
                          <Box className={styles['error-box']}>
                            <Text color="red">{errors.confirmPassword?.message}</Text>
                          </Box>
                        </Flex>
                      )}
                    </Flex>
                  )}
                </FormControl>
              </form>
              {/* <Box className={styles['error-box']}>{errorMessage}</Box> */}
            </Stack>
          </Flex>
          <ModalFooter>
            <Flex justify="flex-end">
              {viewState === 'edit' && (
                <>
                  <Button
                    variant="outline"
                    className={styles['create-account-button']}
                    type="submit"
                    mr={3}
                    onClick={cancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    className={styles['create-account-button']}
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Save Changes
                  </Button>
                </>
              )}
              {viewState === 'view' && (
                <Button
                  color="white"
                  background="#718096"
                  _hover={{ bg: '#718096' }}
                  _focus={{ bg: '#718096' }}
                  onClick={() => {
                    setViewState('edit');
                  }}
                >
                  Edit Profile
                </Button>
              )}
              {/* <Modal isOpen={saveIsOpen} onClose={saveOnClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Save before exiting?</ModalHeader>
                  <ModalCloseButton onClick={cancel} />
                  <ModalBody>Are you sure you want to exit without saving?</ModalBody>

                  <ModalFooter>
                    <Button variant="outline" mr={3} onClick={cancel}>
                      Exit
                    </Button>
                    <Button colorScheme="blue" onClick={closeModals}>
                      Save and Exit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal> */}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

EditAccountModal.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setUsers: PropTypes.func,
  setAdminUsers: PropTypes.func,
  setDriverUsers: PropTypes.func,
};

EditAccountModal.defaultProps = {
  setUsers: () => {},
  setAdminUsers: () => {},
  setDriverUsers: () => {},
};

export default EditAccountModal;

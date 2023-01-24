import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
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
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Select,
  IconButton,
  InputLeftElement,
  InputGroup,
} from '@chakra-ui/react';
import { EditIcon, LockIcon } from '@chakra-ui/icons';
import { registerWithEmailAndPassword } from '../../utils/AuthUtils';
import styles from './EditAccountModal.module.css';
import AUTH_ROLES from '../../utils/AuthConfig';
import { passwordRequirementsRegex } from '../../utils/utils';

const { ADMIN_ROLE } = AUTH_ROLES.AUTH_ROLES;

const EditAccountModal = ({ isSuperAdmin, memberType, userProfile }) => {
  const [role] = useState(ADMIN_ROLE);
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

  const onSubmit = async e => {
    try {
      const { firstName, lastName, email } = e;

      const user = {
        firstName,
        lastName,
        email,
        role,
      };
      await registerWithEmailAndPassword(user);
      setErrorMessage('User successfully created');
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
  const { isOpen: saveIsOpen, onOpen: saveOnOpen, onClose: saveOnClose } = useDisclosure();

  const closeModals = () => {
    saveOnClose();
    onClose();
  };

  return (
    <>
      <IconButton onClick={onOpen} icon={<EditIcon />} variant="ghost" />
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Flex m={5}>
            <Stack>
              <Heading className={styles['create-account-title']}>Edit {memberType}</Heading>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl className={styles['create-account-form']}>
                  <Flex>
                    <Flex direction="column" mr={8}>
                      <FormLabel className={styles['create-account-form-label']}>
                        First Name
                      </FormLabel>
                      <Input
                        id="first-name"
                        style={{ width: '240px' }}
                        defaultValue={userProfile.firstName}
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
                        defaultValue={userProfile.lastName}
                        {...register('lastName')}
                        isRequired
                      />
                      <Box className={styles['error-box']}>{errors.lastName?.message}</Box>
                    </Flex>
                  </Flex>
                  <Flex>
                    <Flex direction="column" mr={8}>
                      <FormLabel className={styles['create-account-form-label']}>Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <LockIcon color="black.300" />
                        </InputLeftElement>
                        <Input
                          type="email"
                          id="email"
                          style={{ width: '240px' }}
                          placeholder="Enter email"
                          value={userProfile.email}
                          {...register('email')}
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
                      <Input
                        type="tel"
                        id="phone-number"
                        style={{ width: '240px' }}
                        defaultValue={userProfile.phoneNumber}
                        {...register('phoneNumber')}
                        isRequired
                      />
                      <Box className={styles['error-box']}>{errors.phoneNumber?.message}</Box>
                    </Flex>
                  </Flex>
                  {isSuperAdmin ? (
                    <Flex>
                      <Flex direction="column">
                        <FormLabel className={styles['create-account-form-label']}>Role</FormLabel>
                        <Select style={{ width: '240px' }}>
                          {userProfile.role === 'admin' ? (
                            <>
                              <option value="admin" selected>
                                Admin
                              </option>
                              <option value="driver">Driver</option>
                            </>
                          ) : (
                            <>
                              <option value="admin">Admin</option>
                              <option value="driver" selected>
                                Driver
                              </option>
                            </>
                          )}
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
                onClick={saveOnOpen}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                className={styles['create-account-button']}
                type="submit"
                onClick={onSubmit}
              >
                Save
              </Button>
              <Modal isOpen={saveIsOpen} onClose={saveOnClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Save before exiting?</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>Are you sure you want to exit without saving?</ModalBody>

                  <ModalFooter>
                    <Button mr={3} onClick={closeModals}>
                      Exit
                    </Button>
                    <Button colorScheme="blue" onClick={closeModals}>
                      Save and Exit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

EditAccountModal.propTypes = {
  isSuperAdmin: PropTypes.bool.isRequired,
  memberType: PropTypes.string.isRequired,
  userProfile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
};

export default EditAccountModal;

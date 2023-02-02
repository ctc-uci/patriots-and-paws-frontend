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
  IconButton,
  InputLeftElement,
  InputGroup,
} from '@chakra-ui/react';
import { EditIcon, LockIcon } from '@chakra-ui/icons';
// import { registerWithEmailAndPassword } from '../../utils/AuthUtils';
import styles from './EditAccountModal.module.css';
import { PNPBackend } from '../../utils/utils';

const EditAccountModal = ({ staffProfile, isSuperAdmin }) => {
  let formSchema;
  if (isSuperAdmin) {
    formSchema = yup.object({
      firstName: yup.string().required("Please enter the staff member's first name"),
      lastName: yup.string().required("Please enter the staff member's last name"),
      phoneNumber: yup
        .string()
        .length(10, 'Please enter a ten digit phone number')
        .matches(/^\d{10}$/)
        .required("Please enter the staff member's phone number"),
      // password: yup
      //   .string()
      //   .matches(
      //     passwordRequirementsRegex,
      //     'Password requires at least 8 characters consisting of at least 1 lowercase letter, 1 uppercase letter, 1 symbol, and 1 number.',
      //   ),
      // confirmPassword: yup
      //   .string()
      //   // .required("Please confirm the staff member's password")
      //   .oneOf([yup.ref('password'), null], 'Passwords must both match'),
    });
  } else {
    formSchema = yup.object({
      firstName: yup.string().required("Please enter the staff member's first name"),
      lastName: yup.string().required("Please enter the staff member's last name"),
      phoneNumber: yup
        .string()
        .length(10, 'Please enter a ten digit phone number')
        .matches(/^\d{10}$/),
      // .required("Please enter the staff member's phone number"),
    });
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const [errorMessage, setErrorMessage] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: saveIsOpen, onOpen: saveOnOpen, onClose: saveOnClose } = useDisclosure();

  const closeModals = () => {
    saveOnClose();
    onClose();
  };

  const onSubmit = async e => {
    try {
      const { firstName, lastName, phoneNumber } = e;
      PNPBackend.put(`/users/${staffProfile.id}`, {
        firstName,
        lastName,
        phoneNumber,
      });
      setErrorMessage('User successfully edited');
      closeModals();
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

  return (
    <>
      <IconButton onClick={onOpen} icon={<EditIcon />} variant="ghost" />
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Flex m={5}>
            <Stack>
              <Heading className={styles['create-account-title']} mb={5}>
                Edit Staff
              </Heading>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl className={styles['create-account-form']}>
                  <Flex mb={5}>
                    <Flex direction="column" mr={8}>
                      <FormLabel className={styles['create-account-form-label']}>
                        First Name
                      </FormLabel>
                      <Input
                        id="first-name"
                        style={{ width: '240px' }}
                        defaultValue={staffProfile.firstName}
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
                        defaultValue={staffProfile.lastName}
                        {...register('lastName')}
                        isRequired
                      />
                      <Box className={styles['error-box']}>{errors.lastName?.message}</Box>
                    </Flex>
                  </Flex>
                  <Flex mb={5}>
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
                          value={staffProfile.email}
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
                        defaultValue={staffProfile.phoneNumber}
                        {...register('phoneNumber')}
                        isRequired
                      />
                      <Box className={styles['error-box']}>{errors.phoneNumber?.message}</Box>
                    </Flex>
                  </Flex>
                  {isSuperAdmin ? (
                    <Flex mb={5}>
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
                onClick={handleSubmit(onSubmit)}
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
  staffProfile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
};

export default EditAccountModal;

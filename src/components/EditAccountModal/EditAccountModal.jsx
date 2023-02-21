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
  InputLeftElement,
  InputGroup,
  IconButton,
} from '@chakra-ui/react';
import { LockIcon, CloseIcon } from '@chakra-ui/icons';
import { updateUser } from '../../utils/AuthUtils';
import { passwordRequirementsRegex } from '../../utils/utils';
import styles from './EditAccountModal.module.css';

const EditAccountModal = ({
  data,
  isSuperAdmin,
  isOpen,
  onClose,
  setUsers,
  setAdminUsers,
  setDriverUsers,
}) => {
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
  } else {
    formSchema = yup.object({
      firstName: yup.string().required("Please enter the staff member's first name"),
      lastName: yup.string().required("Please enter the staff member's last name"),
      phoneNumber: yup
        .string()
        .length(10, 'Please enter a ten digit phone number')
        .matches(/^\d{10}$/),
    });
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: data,
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const [errorMessage, setErrorMessage] = useState();
  const originalData = { ...data };

  const { isOpen: saveIsOpen, onOpen: saveOnOpen, onClose: saveOnClose } = useDisclosure();

  const closeModals = () => {
    saveOnClose();
    onClose();
  };

  const cancel = () => {
    reset(originalData);
    saveOnClose();
    onClose();
  };

  useEffect(() => {
    reset(data);
  }, [data]);

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
      setErrorMessage('User successfully edited');
      console.log(setUsers);
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
      closeModals();
    } catch (err) {
      const firebaseErrorMsg = err.message;
      setErrorMessage(firebaseErrorMsg);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <Flex m={5}>
            <Stack>
              <Flex justifyContent="space-between">
                <Heading className={styles['create-account-title']} mb={5}>
                  Edit Staff
                </Heading>
                <IconButton
                  variant="solid"
                  colorScheme="gray"
                  icon={<CloseIcon />}
                  onClick={saveOnOpen}
                />
              </Flex>
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
                          value={data.email}
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
                        {...register('phoneNumber')}
                        isRequired
                      />
                      <Box className={styles['error-box']}>{errors.phoneNumber?.message}</Box>
                    </Flex>
                  </Flex>
                  {isSuperAdmin && (
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
                          {...register('newPassword')}
                          isRequired
                        />
                        <Box className={styles['error-box']}>{errors.newPassword?.message}</Box>
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
                  )}
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
                  <ModalCloseButton onClick={cancel} />
                  <ModalBody>Are you sure you want to exit without saving?</ModalBody>

                  <ModalFooter>
                    <Button mr={3} onClick={cancel}>
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
  setUsers: PropTypes.func.isRequired,
  setAdminUsers: PropTypes.func.isRequired,
  setDriverUsers: PropTypes.func.isRequired,
};

export default EditAccountModal;

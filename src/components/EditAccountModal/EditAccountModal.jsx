/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect } from 'react';
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
  InputLeftElement,
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
import { MdInfo } from 'react-icons/md';
import { updateUser } from '../../utils/AuthUtils';
import { passwordRequirementsRegex } from '../../utils/utils';

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
    values: data,
    resolver: yupResolver(isSuperAdmin ? superAdminFormSchema : defaultFormSchema),
    delayError: 750,
  });

  const toast = useToast();

  const onCancel = () => {
    reset(data);
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

  const onSubmit = async updatedUser => {
    await updateUser(updatedUser, data.id);

    reset({
      newPassword: '',
      confirmPassword: '',
    });

    setUsers(prev => prev.map(user => (user.id === data.id ? updatedUser : user)));
    if (data.role === 'admin') {
      setAdminUsers(prev => prev.map(user => (user.id === data.id ? updatedUser : user)));
    } else {
      setDriverUsers(prev => prev.map(user => (user.id === data.id ? updatedUser : user)));
    }

    toast({
      title: 'Your changes have been saved.',
      status: 'success',
      isClosable: true,
      variant: 'subtle',
      position: 'top',
      duration: 3000,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onCloseComplete={onCancel} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <Flex p="60px 60px 0px 60px" flexDir="column">
          <Flex>
            <Heading fontSize="36px" fontWeight={700} mb="45px">
              {isSuperAdmin ? 'Edit Staff' : 'Edit Driver'}
            </Heading>
            <ModalCloseButton onClick={onCancel} m="40px" size="lg" />
          </Flex>
          <Flex alignItems="center">
            <Stack>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                  <Flex mb="40px">
                    <Flex direction="column" mr={8}>
                      <FormLabel>First Name</FormLabel>
                      <InputGroup>
                        <Input
                          id="first-name"
                          style={{ width: '240px' }}
                          errorBorderColor="red.300"
                          isInvalid={'firstName' in errors}
                          {...register('firstName')}
                          isRequired
                        />
                      </InputGroup>
                    </Flex>
                    <Flex direction="column">
                      <FormLabel>Last Name</FormLabel>
                      <InputGroup>
                        <Input
                          id="last-name"
                          style={{ width: '240px' }}
                          errorBorderColor="red.300"
                          isInvalid={'lastName' in errors}
                          {...register('lastName')}
                          isRequired
                        />
                      </InputGroup>
                    </Flex>
                  </Flex>
                  <Flex mb="40px">
                    <Flex direction="column" mr={8}>
                      <FormLabel>Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <RiLockFill color="black.300" />
                        </InputLeftElement>
                        <Input
                          type="email"
                          id="email"
                          style={{ width: '240px' }}
                          placeholder="Enter email"
                          value={data.email}
                          isReadOnly
                        />
                      </InputGroup>
                      <Box>{errors.email?.message}</Box>
                    </Flex>
                    <Flex direction="column">
                      <FormLabel>Phone Number</FormLabel>
                      <InputGroup>
                        <Input
                          type="tel"
                          id="phone-number"
                          style={{ width: '240px' }}
                          errorBorderColor="red.300"
                          isInvalid={'phoneNumber' in errors}
                          {...register('phoneNumber')}
                          isRequired
                        />
                      </InputGroup>
                    </Flex>
                  </Flex>
                  {isSuperAdmin && (
                    <>
                      <Flex mb="40px">
                        <Flex direction="column" mr={8}>
                          <Flex>
                            <FormLabel mt=".4rem">Password</FormLabel>
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
                          <InputGroup>
                            <Input
                              background="white"
                              type="password"
                              id="password"
                              style={{ width: '240px' }}
                              placeholder="Enter password"
                              errorBorderColor="red.300"
                              isInvalid={'newPassword' in errors}
                              {...register('newPassword')}
                              isRequired
                            />
                          </InputGroup>
                        </Flex>
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
                      </Flex>
                      <Flex direction="column">
                        <FormLabel>Role</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <RiLockFill color="black.300" />
                          </InputLeftElement>
                          <Input style={{ width: '240px' }} value={data.role} isReadOnly />
                        </InputGroup>
                      </Flex>
                    </>
                  )}
                </FormControl>
              </form>
            </Stack>
          </Flex>
        </Flex>
        <ModalFooter p="0px 60px 60px 60px">
          <Flex justify="flex-end" columnGap="20px">
            <Button
              variant="ghost"
              type="submit"
              fontSize="18px"
              p="10px 24px"
              lineHeight="28px"
              fontWeight={600}
              height="48px"
              onClick={onCancel}
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
              Save
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
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

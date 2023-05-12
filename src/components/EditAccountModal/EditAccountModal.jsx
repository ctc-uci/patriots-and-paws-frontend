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
  Stack,
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  InputLeftElement,
  InputGroup,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  ListItem,
  UnorderedList,
  FormErrorMessage,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { RiLockFill } from 'react-icons/ri';
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
      toast.closeAll();
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
    toast.closeAll();
    toast({
      title: 'Your changes have been saved.',
      status: 'success',
      isClosable: true,
      variant: 'subtle',
      position: 'top',
      containerStyle: {
        mt: '6rem',
      },
      duration: 3000,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={onCancel}
      size={{ base: 'md', md: '4xl' }}
    >
      <ModalOverlay />
      <ModalContent>
        <Flex p="30px 60px 0px 60px" justifyContent="center">
          <Stack>
            <ModalHeader fontSize="36px" fontWeight={700}>
              {isSuperAdmin ? 'Edit Staff' : 'Edit Driver'}
            </ModalHeader>
            <ModalCloseButton onClick={onCancel} right="50px" top="30px" size="lg" />
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex mb="40px" gap="60px">
                  <Flex direction="column">
                    <FormControl isInvalid={errors && errors.firstName}>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        id="first-name"
                        w="320px"
                        errorBorderColor="red.300"
                        isInvalid={'firstName' in errors}
                        {...register('firstName')}
                        isRequired
                      />
                      <FormErrorMessage>
                        {errors.firstName && errors.firstName.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex direction="column">
                    <FormControl isInvalid={errors && errors.lastName}>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        id="last-name"
                        w="320px"
                        errorBorderColor="red.300"
                        isInvalid={'lastName' in errors}
                        {...register('lastName')}
                        isRequired
                      />
                      <FormErrorMessage>
                        {errors.lastName && errors.lastName.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Flex>
                <Flex mb="40px" gap="60px">
                  <Flex direction="column">
                    <FormLabel>Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <RiLockFill color="black.300" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        id="email"
                        w="320px"
                        placeholder="Enter email"
                        value={data.email}
                        isReadOnly
                      />
                    </InputGroup>
                    <Box>{errors.email?.message}</Box>
                  </Flex>
                  <Flex direction="column">
                    <FormControl isInvalid={errors && errors.phoneNumber}>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        type="tel"
                        id="phone-number"
                        w="320px"
                        errorBorderColor="red.300"
                        isInvalid={'phoneNumber' in errors}
                        {...register('phoneNumber')}
                        isRequired
                      />
                      <FormErrorMessage>
                        {errors.phoneNumber && errors.phoneNumber.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Flex>
                {isSuperAdmin ? (
                  <>
                    <Flex mb="40px" gap="60px">
                      <Flex direction="column">
                        <FormControl isInvalid={errors && errors.newPassword}>
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
                            background="white"
                            type="password"
                            id="password"
                            w="320px"
                            placeholder="Enter password"
                            errorBorderColor="red.300"
                            isInvalid={'newPassword' in errors}
                            {...register('newPassword')}
                            isRequired
                          />
                          <FormErrorMessage maxWidth="320px">
                            {errors.newPassword && errors.newPassword.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                      <Flex direction="column">
                        <FormControl isInvalid={errors && errors.confirmPassword}>
                          <FormLabel>Confirm Password</FormLabel>
                          <Input
                            type="password"
                            id="check-password"
                            w="320px"
                            placeholder="Re-enter password"
                            errorBorderColor="red.300"
                            isInvalid={'confirmPassword' in errors}
                            {...register('confirmPassword')}
                            isRequired
                          />
                          <FormErrorMessage>
                            {errors.confirmPassword && errors.confirmPassword.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                    </Flex>
                    <Flex pb="60px" justifyContent="space-between">
                      <Flex direction="column">
                        <FormLabel>Role</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <RiLockFill color="black.300" />
                          </InputLeftElement>
                          <Input w="320px" value={data.role} isReadOnly />
                        </InputGroup>
                      </Flex>
                      <ModalFooter pr={0} pb={0}>
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
                    </Flex>
                  </>
                ) : (
                  <ModalFooter p="0px 0px 60px 60px">
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
                )}
              </form>
            </ModalBody>
          </Stack>
        </Flex>
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

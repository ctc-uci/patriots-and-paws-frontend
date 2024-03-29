import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
  Grid,
  GridItem,
  useDisclosure,
  InputRightElement,
  IconButton,
  InputGroup,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { confirmNewPassword, useNavigate } from '../../utils/AuthUtils';
import PasswordConfirmationModal from '../PasswordConfirmationModal/PasswordConfirmationModal';

const ResetPassword = ({ code }) => {
  const [errorMessage, setErrorMessage] = useState();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [displayPasswordRequirements, setDisplayPasswordRequirements] = useState(false);
  const { isOpen, onOpen } = useDisclosure();
  const navigate = useNavigate();

  const formSchema = yup.object({
    newPassword: yup.string().required('Please enter your new password'),
    confirmNewPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('newPassword'), null], 'Passwords must both match'),
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const inputtedPassword = watch('newPassword', '');

  const handleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPassword = async e => {
    try {
      const { newPassword, confirmNewPassword: confirmPassword } = e;

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords don't match");
      }
      await confirmNewPassword(code, newPassword);
      onOpen();
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleOnClose = () => {
    navigate('/login');
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={0}>
      <GridItem w="100%" h="100vh" bgGradient="linear(to-br, #F37C7C, #435FC0)" />
      <GridItem>
        <Flex minH="100vh" justify="center">
          <Stack width="55%" margin="auto" padding="20 20 0 20">
            <Heading fontSize="40px" mb={7}>
              Reset Password
            </Heading>
            <PasswordConfirmationModal isOpen={isOpen} onClose={handleOnClose} />
            <form onSubmit={handleSubmit(handleResetPassword)}>
              <FormControl onSubmit={handleResetPassword}>
                <FormLabel fontSize="16px" fontWeight="500">
                  New Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword')}
                    _placeholder={{ fontSize: '10px' }}
                    borderColor={errors.newPassword ? 'red.500' : 'gray.300'}
                    onClick={() => setDisplayPasswordRequirements(true)}
                    isRequired
                  />
                  <InputRightElement>
                    <IconButton
                      icon={
                        showNewPassword ? <ViewOffIcon boxSize={5} /> : <ViewIcon boxSize={5} />
                      }
                      onClick={handleNewPasswordVisibility}
                      variant="ghost"
                      pr={2}
                    />
                  </InputRightElement>
                </InputGroup>
                <Box mt={2} textColor="red.500">
                  {errors.newPassword?.message}
                </Box>
                {displayPasswordRequirements && (
                  <Flex
                    align="center"
                    mt={2}
                    visibility={!displayPasswordRequirements && 'hidden'}
                    flexDirection="column"
                    alignItems="left"
                  >
                    <Text color={inputtedPassword.length >= 8 ? 'green.500' : 'red.500'}>
                      {inputtedPassword.length >= 8 ? (
                        <CheckIcon color="green.500" mr={2} />
                      ) : (
                        <CloseIcon color="red.500" mr={3} boxSize={3} />
                      )}
                      &nbsp;8 characters
                    </Text>
                    <Text color={/[a-z]/.test(inputtedPassword) ? 'green.500' : 'red.500'}>
                      {/[a-z]/.test(inputtedPassword) ? (
                        <CheckIcon color="green.500" mr={2} />
                      ) : (
                        <CloseIcon color="red.500" mr={3} boxSize={3} />
                      )}
                      &nbsp;1 lowercase letter
                    </Text>
                    <Text color={/[A-Z]/.test(inputtedPassword) ? 'green.500' : 'red.500'}>
                      {/[A-Z]/.test(inputtedPassword) ? (
                        <CheckIcon color="green.500" mr={2} />
                      ) : (
                        <CloseIcon color="red.500" mr={3} boxSize={3} />
                      )}
                      &nbsp;1 uppercase letter
                    </Text>
                    <Text color={/[@$!%*?&]/.test(inputtedPassword) ? 'green.500' : 'red.500'}>
                      {/[@$!%*?&]/.test(inputtedPassword) ? (
                        <CheckIcon color="green.500" mr={2} />
                      ) : (
                        <CloseIcon color="red.500" mr={3} boxSize={3} />
                      )}
                      &nbsp;1 symbol
                    </Text>
                    <Text color={/(?=.*\d)/.test(inputtedPassword) ? 'green.500' : 'red.500'}>
                      {/(?=.*\d)/.test(inputtedPassword) ? (
                        <CheckIcon color="green.500" mr={2} />
                      ) : (
                        <CloseIcon color="red.500" mr={3} boxSize={3} />
                      )}
                      &nbsp;1 number
                    </Text>
                  </Flex>
                )}

                <FormLabel fontSize="16px" fontWeight="500" mt={10}>
                  Confirm Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmNewPassword')}
                    _placeholder={{ fontSize: '10px' }}
                    borderColor={errors.confirmNewPassword ? 'red.500' : 'gray.300'}
                    isRequired
                  />
                  <InputRightElement>
                    <IconButton
                      icon={
                        showConfirmPassword ? <ViewOffIcon boxSize={5} /> : <ViewIcon boxSize={5} />
                      }
                      onClick={handleConfirmPasswordVisibility}
                      variant="ghost"
                      pr={2}
                    />
                  </InputRightElement>
                </InputGroup>
                <Box mt={2} textColor="red.500">
                  {errors.confirmNewPassword?.message}
                </Box>
                {errorMessage && (
                  <Box mt={2} textColor="red.500">
                    {errorMessage}
                  </Box>
                )}
                <Button colorScheme="blue" type="submit" width="100%" mt={14}>
                  Reset Password
                </Button>
              </FormControl>
            </form>
          </Stack>
        </Flex>
      </GridItem>
    </Grid>
  );
};

ResetPassword.propTypes = {
  code: PropTypes.string.isRequired,
};

export default ResetPassword;

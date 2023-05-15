import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Link,
  Box,
  useDisclosure,
  Grid,
  GridItem,
  Flex,
  Text,
  Stack,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { sendPasswordReset } from '../../utils/AuthUtils';
import EmailSentModal from '../EmailSentModal/EmailSentModal';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formSchema = yup.object({
    email: yup.string().email().required('Please enter your email address'),
  });
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const handleForgotPassword = async data => {
    try {
      const { email } = data;
      await sendPasswordReset(email);
      onOpen();
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    await sendPasswordReset(email);
    navigate('/login');
  };

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={0}>
      <GridItem
        w="100%"
        h={{ base: '30vh', md: '100vh' }}
        bgGradient="linear(to-br, #F37C7C, #435FC0)"
      />
      <GridItem w="100%" padding={10}>
        <Flex height="100%" position="relative">
          <Stack width="100%" zIndex="1" position="absolute">
            <Link href="/login">
              <Button variant="unstyled" fontWeight="normal">
                <Flex alignItems="center">
                  <ChevronLeftIcon boxSize={6} />
                  <Text marginLeft={3} fontSize="18px">
                    Return to Login
                  </Text>
                </Flex>
              </Button>
            </Link>
          </Stack>
          <Grid placeItems="center" height="100%" width="100%">
            <GridItem>
              <Stack
                justifyContent="center"
                maxW={{ base: '90%', md: '70%', lg: '60%' }}
                width="100%"
                margin="auto"
              >
                <Heading as="h1" fontSize="3rem" mb={1} mt={{ base: '1em', md: 0 }}>
                  Forgot Password
                </Heading>
                <Text fontSize="1rem" color="gray.400">
                  Enter your email address below to receive an email about resetting the account
                  password.
                </Text>
                {errorMessage && <Box>{errorMessage}</Box>}
                <Stack width="100%">
                  <form onSubmit={handleSubmit(handleForgotPassword)}>
                    <FormControl width="100%">
                      <FormLabel
                        fontSize="16px"
                        fontWeight="normal"
                        textAlign="left"
                        marginTop={10}
                      >
                        Email Address
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder="name@domain.com"
                        {...register('email')}
                        isRequired
                        width="100%"
                      />
                      <Box>{errors.email?.message}</Box>
                      <Button
                        colorScheme="blue"
                        type="submit"
                        marginTop={14}
                        padding={6}
                        width="100%"
                      >
                        Send Email
                      </Button>
                    </FormControl>
                  </form>
                </Stack>
                <EmailSentModal
                  isOpen={isOpen}
                  onClose={handleCloseModal}
                  onSubmit={handleResendEmail}
                />
                ;
              </Stack>
            </GridItem>
          </Grid>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default ForgotPassword;

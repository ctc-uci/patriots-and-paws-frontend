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
  VStack,
  HStack,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { sendPasswordReset } from '../../utils/AuthUtils';
import EmailSentModal from '../EmailSentModal/EmailSentModal';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
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
  };

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={0}>
      <GridItem w="100%" h="100vh" bgGradient="linear(to-br, #F37C7C, #435FC0)" />
      <GridItem w="100%" padding={5}>
        <Link href="/login">
          <Button variant="unstyled" fontWeight="normal">
            <Flex alignItems="center">
              <ChevronLeftIcon boxSize={6} />
              <span style={{ marginLeft: 10 }}>Return to Login</span>
            </Flex>
          </Button>
        </Link>
        <Flex height="90vh" alignItems="center" justifyContent="center">
          <VStack spacing={10}>
            <Heading as="h1">Forgot Password</Heading>
            <Text fontSize="xl">Enter email to gain access to password reset instructions...</Text>
            {errorMessage && <Box>{errorMessage}</Box>}
            <form onSubmit={handleSubmit(handleForgotPassword)}>
              <FormControl className={styles['forgot-password-form']} isRequired>
                <Box alignItems="center" justifyContent="center" width={{ base: '100%', xl: 500 }}>
                  <FormLabel
                    fontSize="xl"
                    fontWeight="normal"
                    textAlign="left"
                    className={styles['forgot-password-label']}
                  >
                    Email
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="ex: johndoePNP@gmail.com"
                    {...register('email')}
                    colorScheme="gray"
                    variant="filled"
                    isRequired
                  />
                </Box>
                <Box className={styles['error-box']}>{errors.email?.message}</Box>
                <HStack width="100%" alignItems="center" justifyContent="center">
                  <Button colorScheme="blue" type="submit" marginTop={10} padding={6}>
                    Send Email
                  </Button>
                </HStack>
              </FormControl>
            </form>
            <EmailSentModal
              isOpen={isOpen}
              onClose={handleCloseModal}
              onSubmit={handleResendEmail}
            />
            ;
          </VStack>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { instanceOf } from 'prop-types';
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
  Link,
  Stack,
  Alert,
  AlertIcon,
  Box,
  Spinner,
  Grid,
  GridItem,
  AlertTitle,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  // ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Cookies, withCookies } from '../../utils/CookieUtils';
import {
  logInWithEmailAndPassword,
  useNavigate,
  userIsAuthenticated,
  sendPasswordReset,
} from '../../utils/AuthUtils';
import EmailSentModal from '../EmailSentModal/EmailSentModal';

const Login = ({ cookies }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  // toggle password visibility
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const handlePasswordVisibility = () => setPasswordVisibility(!passwordVisibility);

  const formSchema = yup.object({
    email: yup.string().email().required('Please enter your email address'),
    password: yup.string().required('Please enter your password'),
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const { search } = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEmailSentModal,
    onOpen: onOpenEmailSentModal,
    onClose: onCloseEmailSentModal,
  } = useDisclosure();
  const signup = new URLSearchParams(search).get('signup');

  const handleResendEmail = async () => {
    const email = getValues('email');
    await sendPasswordReset(email);
    navigate('/login');
  };

  const handleForgotPassword = async data => {
    try {
      const { email } = data;
      await sendPasswordReset(email);
      onOpenEmailSentModal();
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  useEffect(() => {
    const checkUserAuthentication = async () => {
      const authenticated = await userIsAuthenticated(cookies);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    checkUserAuthentication();
  }, []);

  /**
   * This function handles logging in with email/password (standard log in)
   * If the user signs in successfully, they are redirected to the dashboard, otherwise they are redirected to the login screen
   * @param {Event} e
   */
  const handleLogin = async e => {
    try {
      await logInWithEmailAndPassword(e.email, e.password, '/', navigate, cookies);
    } catch (err) {
      const errorCode = err.code;
      const firebaseErrorMsg = err.message;

      if (errorCode === 'auth/wrong-password') {
        setErrorMessage('Email address or password does not match our records!');
      } else if (errorCode === 'auth/invalid-email') {
        setErrorMessage('Email address or password does not match our records!');
      } else if (errorCode === 'auth/unverified-email') {
        setErrorMessage('Please verify your email address.');
      } else if (errorCode === 'auth/user-not-found') {
        setErrorMessage('Email address or password does not match our records!');
      } else if (errorCode === 'auth/user-disabled') {
        setErrorMessage('This account has been disabled.');
      } else if (errorCode === 'auth/too-many-requests') {
        setErrorMessage('Too many attempts. Please try again later.');
      } else if (errorCode === 'auth/user-signed-out') {
        setErrorMessage('You have been signed out. Please sign in again.');
      } else {
        setErrorMessage(firebaseErrorMsg);
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Grid
      templateColumns={{ md: 'repeat(2, 1fr)' }}
      templateRows={{ base: 'repeat(2, 1fr)', md: 'none' }}
      gap={0}
    >
      <GridItem
        w="100%"
        h={{ base: '50vh', md: '100vh' }}
        bgGradient="linear(to-br, #F37C7C, #435FC0)"
      />
      <GridItem>
        <Flex minH={{ md: '100vh' }} align="center" justify="center">
          <Stack align="center" width="100%" margin="auto">
            <Stack width="70%" padding={{ base: 3, md: 9 }}>
              {signup === 'success' && (
                <Alert status="success" variant="solid" bgColor="green">
                  <AlertIcon />
                  You have successfully logged in.
                </Alert>
              )}
              {errorMessage && (
                <Alert status="error" rounded="md" mb="1em">
                  <Flex direction="row" verticalAlign="center" align="center">
                    <AlertIcon ml="0.75%" boxSize="5.5%" />
                    <Flex direction="column" ml="0.75%">
                      <AlertTitle fontSize="md">{errorMessage}</AlertTitle>
                    </Flex>
                  </Flex>
                </Alert>
              )}
              <Heading fontSize="3rem">Staff Login</Heading>
              <Link
                href="/forgot-password"
                color="#3182ce"
                fontSize="1rem"
                display={{ base: 'none', md: 'block' }}
              >
                Forgot Password?
              </Link>
              <Stack width="100%">
                <form onSubmit={handleSubmit(handleLogin)}>
                  <FormControl isRequired>
                    <FormLabel fontSize="16px" fontWeight="500" mt={10}>
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      id="email"
                      placeholder="name@domain.com"
                      {...register('email')}
                      isRequired
                    />
                    <Box>{errors.email?.message}</Box>
                    <FormLabel fontSize="16px" fontWeight="500" mt={10}>
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={passwordVisibility ? 'text' : 'password'}
                        id="password"
                        placeholder="***********"
                        {...register('password')}
                        isRequired
                      />
                      <InputRightElement>
                        <Button
                          onClick={handlePasswordVisibility}
                          h="1.75rem"
                          size="xs"
                          colorScheme="whiteAlpha"
                        >
                          {passwordVisibility ? (
                            <AiFillEyeInvisible size={22} color="#232323" />
                          ) : (
                            <AiFillEye size={22} color="#232323" />
                          )}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <Box>{errors.password?.message}</Box>
                    <Button colorScheme="blue" type="submit" width="100%" mt={14}>
                      Login
                    </Button>
                    <Button
                      fontSize="1rem"
                      mt={4}
                      display={{ base: 'block', md: 'none' }}
                      justify="center"
                      onClick={onOpen}
                    >
                      Forgot Password?
                    </Button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Forgot Password</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Stack
                            justifyContent="center"
                            maxW={{ base: '90%', md: '70%', lg: '60%' }}
                            width="100%"
                            margin="auto"
                          >
                            <Text fontSize="1rem" color="gray.400">
                              Enter your email address below to receive an email about resetting the
                              account password.
                            </Text>
                            {errorMessage && <Box>{errorMessage}</Box>}
                            <Stack width="100%">
                              <form>
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
                                    marginTop={14}
                                    padding={6}
                                    width="100%"
                                    onClick={handleForgotPassword}
                                  >
                                    Send Email
                                  </Button>
                                </FormControl>
                              </form>
                            </Stack>
                            <EmailSentModal
                              isOpen={isOpenEmailSentModal}
                              onClose={onCloseEmailSentModal}
                              onSubmit={handleResendEmail}
                            />
                            ;
                          </Stack>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  </FormControl>
                </form>
              </Stack>
            </Stack>
          </Stack>
        </Flex>
      </GridItem>
    </Grid>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);

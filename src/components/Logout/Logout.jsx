import React, { useState } from 'react';
import { instanceOf } from 'prop-types';
import { Flex, Button, Heading, Stack, Box } from '@chakra-ui/react';
import { logout, useNavigate } from '../../utils/AuthUtils';
import { Cookies, withCookies, clearCookies } from '../../utils/CookieUtils';
import styles from './Logout.module.css';

const Logout = ({ cookies }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const handleSubmit = async () => {
    try {
      clearCookies(cookies);
      await logout('/login', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack align="center">
        <Heading>Logout</Heading>
        {errorMessage && <Box>{errorMessage}</Box>}
        <Button
          colorScheme="blue"
          className={styles['logout-button']}
          onClick={e => {
            handleSubmit(e);
          }}
        >
          Logout
        </Button>
      </Stack>
    </Flex>
  );
};

Logout.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Logout);

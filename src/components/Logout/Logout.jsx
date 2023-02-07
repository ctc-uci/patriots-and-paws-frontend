import React, { useState } from 'react';
import { instanceOf } from 'prop-types';
import { Button, Box, Stack } from '@chakra-ui/react';
import { logout, useNavigate } from '../../utils/AuthUtils';
import { Cookies, withCookies } from '../../utils/CookieUtils';
import styles from './Logout.module.css';

const Logout = ({ cookies }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const handleSubmit = async () => {
    try {
      await logout('/login', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <Stack>
      <Button className={styles['logout-button']} colorScheme="red" onClick={handleSubmit}>
        Logout
      </Button>
      {errorMessage && <Box>{errorMessage}</Box>}
    </Stack>
  );
};

Logout.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Logout);

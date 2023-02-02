import React from 'react';
import { Flex, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import Logout from '../../components/Logout/Logout';
import UserDetails from '../../components/UserDetails/UserDetails';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { userId } = useParams();

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack className={styles['profile-stack']} align="center">
        <UserDetails userId={userId} />
        <Logout />
      </Stack>
    </Flex>
  );
};

export default UserProfile;

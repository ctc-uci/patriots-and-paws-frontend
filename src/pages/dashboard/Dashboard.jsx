import React, { useEffect, useState } from 'react';
import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import Logout from '../../components/Logout/Logout';
import { getUserFromDB } from '../../utils/AuthUtils';

const Dashboard = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const userFromDB = await getUserFromDB();
      setUser(userFromDB);
    };
    fetchUserFromDB();
  }, []);

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack align="center">
        <Heading>DASHBOARD</Heading>
        <Text>Hello, {user.firstName}!</Text>
        <Logout />
      </Stack>
    </Flex>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flex, Heading, Stack, Text, Button } from '@chakra-ui/react';
import { getUserFromDB, getCurrentUserId } from '../../utils/AuthUtils';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const userFromDB = await getUserFromDB(currentUserId);
      setUser(userFromDB);
    };
    fetchUserFromDB();
  }, []);

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack align="center">
        <Heading>DASHBOARD</Heading>
        <Text>Hello, {user.firstName}!</Text>
        <Button colorScheme="blue">
          <Link to={`/users/${user.id}`}>User Profile</Link>
        </Button>
      </Stack>
    </Flex>
  );
};

export default Dashboard;

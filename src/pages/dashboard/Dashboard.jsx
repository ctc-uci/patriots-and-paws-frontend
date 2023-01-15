import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flex, Heading, Stack, Text, Button } from '@chakra-ui/react';
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
        <Button colorScheme="blue">
          <Link to={`/users/${user.id}`}>User Profile</Link>
        </Button>
      </Stack>
    </Flex>
  );
};

export default Dashboard;

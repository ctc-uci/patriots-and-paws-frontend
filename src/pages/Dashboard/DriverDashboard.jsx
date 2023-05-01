import React from 'react';
import { Flex } from '@chakra-ui/react';
import RouteCalendar from '../../components/RouteCalendar/RouteCalendar';
import TodayRoute from '../../components/TodayRoute/TodayRoute';

const DriverDashboard = () => {
  return (
    <Flex
      direction="row-reverse"
      flexWrap="wrap"
      w="100%"
      alignItems="flex-start"
      p={{ base: '1em', md: '0' }}
    >
      <RouteCalendar />
      <TodayRoute />
    </Flex>
  );
};

export default DriverDashboard;

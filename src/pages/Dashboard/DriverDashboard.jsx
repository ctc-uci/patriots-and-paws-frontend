import React from 'react';
import { Flex } from '@chakra-ui/react';
import RouteCalendar from '../../components/RouteCalendar/RouteCalendar';
import TodayRoute from '../../components/TodayRoute/TodayRoute';

const DriverDashboard = () => {
  return (
    <Flex direction="row">
      <TodayRoute mr={5} />
      <RouteCalendar />
    </Flex>
  );
};

export default DriverDashboard;

import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import RouteCalendar from '../../components/RouteCalendar/RouteCalendar';
import TodayRoute from '../../components/TodayRoute/TodayRoute';

const DriverDashboard = () => {
  return (
    <Flex direction="row">
      <Box width="40vw" bg="#EDF1F8">
        <TodayRoute />
      </Box>
      <Box height="90vh" width="60vw" padding="40px">
        <RouteCalendar />
      </Box>
    </Flex>
  );
};

export default DriverDashboard;

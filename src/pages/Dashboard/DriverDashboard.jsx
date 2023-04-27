import React from 'react';
import { Flex } from '@chakra-ui/react';
import RouteCalendar from '../../components/RouteCalendar/RouteCalendar';
import TodayRoute from '../../components/TodayRoute/TodayRoute';

const breakpoints = {
  sm: '30em', // 480px
  md: '48em', // 768px
  lg: '62em', // 992px
  xl: '80em', // 1280px
  '2xl': '96em', // 1536px
};

const breakpointM = {
  base: '100000rem',
};

const DriverDashboard = () => {
  return (
    <Flex direction="row-reverse" flexWrap="wrap" w="100%">
      <RouteCalendar mt={breakpointM} />
      <TodayRoute mr={5} />
    </Flex>
  );
};

export default DriverDashboard;

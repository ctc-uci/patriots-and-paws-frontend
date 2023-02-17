import React, { useEffect, useState } from 'react';
import { Flex, Stack, Text } from '@chakra-ui/react';
import './DriverDashboard.module.css';
import { PNPBackend } from '../../utils/utils';
import { makeDate } from '../../utils/InventoryUtils';

import { getCurrentUserId } from '../../utils/AuthUtils';
// import Driver from '../Dashboard/Drivers';

const DriverDashboard = () => {
  const [donations, setDonations] = useState();
  const [route, setRoute] = useState();
  const getDonationsForToday = async () => {
    const userId = getCurrentUserId();
    const result = await PNPBackend.get(`/routes/driver/${userId}`);
    const today = '2023-02-06T08:00:00.000Z';
    const route2 = result.data.find(route3 => route3.date === today);
    const data = await PNPBackend.get(`/routes/${route2.id}`);
    // const don = await PNPBackend.get(`/donations/${route.id}`);
    // console.log(don);
    setRoute(route2);
    const { donations2 } = data.data[0];
    setDonations(donations2.data);
    // console.log(donations);
    // console.log(route.id);
  };

  useEffect(() => {
    getDonationsForToday();
  }, []);

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack align="center">
        <Text>Route #{route && route.id}</Text>
        <Text>{makeDate(route && route.date)}</Text>
        {donations &&
          donations.map(d => (
            <Text key={d.id}>
              {d.orderNum} {d.firstName} {d.lastName}{' '}
            </Text>
          ))}
      </Stack>
    </Flex>
  );
};

export default DriverDashboard;

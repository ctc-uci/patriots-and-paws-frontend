import React, { useEffect, useState } from 'react';
import { Flex, Stack, Text, Card, CardBody, Button, Checkbox, Tag } from '@chakra-ui/react';
import './TodayRoute.module.css';
import { PNPBackend } from '../../utils/utils';
import { makeDate } from '../../utils/InventoryUtils';

import { getCurrentUserId } from '../../utils/AuthUtils';

const TodayRoute = () => {
  const [donations, setDonations] = useState();
  const [route, setRoute] = useState();
  const getDonationsForToday = async () => {
    const userId = getCurrentUserId();
    console.log(userId);
    const result = await PNPBackend.get(`/routes/driver/${userId}`);
    console.log(result.data);
    const today = '2023-02-16T08:00:00.000Z';
    const route2 = result.data.find(route3 => route3.date === today);
    const hardCodedRoute = 11;
    // const data = await PNPBackend.get(`/routes/${route2.id}`);
    const data = await PNPBackend.get(`/routes/${hardCodedRoute}`);
    // const don = await PNPBackend.get(`/donations/${route.id}`);
    // console.log(don);
    setRoute(route2);
    const donations2 = data.data[0].donations;
    setDonations(donations2);
    // console.log(donations2);
    // console.log(donations);
    // console.log(route.id);
  };

  useEffect(() => {
    getDonationsForToday();
  }, []);

  return (
    <Flex minH="100vh">
      <Stack align="center">
        <Text>Route #{route && route.id}</Text>
        <Text>{makeDate(route && route.date)}</Text>
        {donations &&
          donations.map(d => (
            <Card key={d.id}>
              <CardBody>
                <Flex direction="row">
                  <Flex direction="column">
                    <Text>Donation #{d.orderNum}</Text>
                    <Text>Items: 8</Text>
                  </Flex>
                  <Button mr={5} ml={5}>
                    INFO
                  </Button>
                  <Tag>
                    <Checkbox>Pickup Complete</Checkbox>
                  </Tag>
                </Flex>
              </CardBody>
            </Card>
          ))}
      </Stack>
    </Flex>
  );
};

export default TodayRoute;

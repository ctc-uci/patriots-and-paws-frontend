import React, { useEffect, useState } from 'react';
import { Flex, Text, Button, Box, useDisclosure } from '@chakra-ui/react';
import './TodayRoute.module.css';
import { PNPBackend, handleNavigateToAddress } from '../../utils/utils';
import { makeDate } from '../../utils/InventoryUtils';

import { getCurrentUserId } from '../../utils/AuthUtils';
import DonationModal from '../InventoryPage/DonationModal';
import DonationCard from './DonationCard';

const TodayRoute = () => {
  const [donations, setDonations] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [route, setRoute] = useState({});

  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  const getFurnitureCount = furniture => {
    return furniture.reduce((acc, { count }) => {
      return acc + count;
    }, 0);
  };

  const getDonationsForToday = async () => {
    const userId = getCurrentUserId();
    const { data: driverRoutes } = await PNPBackend.get(`/routes/driver/${userId}`);
    // const today = '2023-03-06T08:00:00.000Z';
    const today = new Date('2023-03-07T08:00:00.000Z').toISOString();
    // const today = new Date().toISOString();

    const todayRoute = driverRoutes.find(route3 => route3.date === today);
    if (todayRoute) {
      const { data } = await PNPBackend.get(`/routes/${todayRoute.id}`);
      const donationInfo = data[0].donations;
      setDonations(donationInfo);
      setRoute({ date: today, name: todayRoute.name, isRoute: true });
    } else {
      setRoute({ date: today, name: 'No Route Today', isRoute: false });
    }
  };

  useEffect(() => {
    getDonationsForToday();
  }, []);

  return (
    <Flex h="90vh">
      {route.isRoute ? (
        <Flex flexDirection="column" gap={5} padding="25px" w="100%">
          <Flex flexDirection="column">
            <Text fontSize="3xl" as="b">
              {route.name}
            </Text>
            <Text>{makeDate(route.date)}</Text>
          </Flex>

          <Flex flexDirection="column" gap={5} height="70vh" overflow="scroll">
            {donations &&
              donations.map(d => {
                return (
                  <DonationCard
                    key={d.id}
                    itemsCount={getFurnitureCount(d.furniture)}
                    data={d}
                    handleRowClick={handleRowClick}
                  />
                );
              })}
          </Flex>

          <DonationModal data={donationData} onClose={onClose} onOpen={onOpen} isOpen={isOpen} />

          <Box textAlign="right">
            <Button
              size="sm"
              bg="#319795"
              color="white"
              mr="2%"
              onClick={() => handleNavigateToAddress(donations)}
            >
              Navigate to Route
            </Button>
            <Button size="sm" bg="rgba(0, 0, 0, 0.36)" color="white">
              Export PDF
            </Button>
          </Box>
        </Flex>
      ) : (
        <Flex w="40vw" h="90vh" justifyContent="center" alignItems="center">
          <Box textAlign="center" color="rgba(0, 0, 0, 0.48)">
            <Text fontSize="4xl" as="b">
              No Route Today
            </Text>
            <Text>{makeDate(route.date)}</Text>
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default TodayRoute;

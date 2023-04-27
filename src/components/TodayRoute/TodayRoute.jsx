import React, { useEffect, useState } from 'react';
import {
  Flex,
  Stack,
  Text,
  Button,
  Checkbox,
  Tag,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Center,
  useDisclosure,
  Box,
  Heading,
} from '@chakra-ui/react';
import './TodayRoute.module.css';
import { PNPBackend } from '../../utils/utils';
import { routeFormatDate } from '../../utils/InventoryUtils';

import { getCurrentUserId } from '../../utils/AuthUtils';
import DonationModal from '../InventoryPage/DonationModal';
import { STATUSES } from '../../utils/config';

const { PICKED_UP } = STATUSES;

const TodayRoute = () => {
  const [donations, setDonations] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [route, setRoute] = useState();
  // { date: new Date('3/06/2023').toISOString(), name: 'awesome route', }
  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  const getFurnitureCount = furniture => {
    return furniture.reduce((acc, { count }) => {
      return acc + count;
    }, 0);
  };

  // useEffect(() => {
  //   console.log(route);
  // }, [route]);

  const getDonationsForToday = async () => {
    const userId = getCurrentUserId();
    const { data: driverRoutes } = await PNPBackend.get(`/routes/driver/${userId}`);
    const today = new Date().toISOString();
    const todayRoute = driverRoutes.find(route3 => route3.date === today);
    if (todayRoute) {
      const { data } = await PNPBackend.get(`/routes/${todayRoute.id}`);
      const donationInfo = data[0].donations;
      setDonations(donationInfo);
    } else {
      // setRoute({ date: today, name: 'No Route Today' });
      setRoute();
    }
  };

  useEffect(() => {
    getDonationsForToday();
  }, []);

  const pickupComplete = id => {
    PNPBackend.put(`/donations/${id}`, {
      status: PICKED_UP,
    });
  };

  const breakpointsH = {
    base: '15rem', // 0-48em
    md: '15rem', // 48em-80em,
    lg: 'calc(100vh)',
    xl: 'calc(100vh)', // 80em+
  };
  const breakpointsW = {
    base: '100%', // 0-48em
    md: '100%', // 48em-80em,
    lg: '30%',
    xl: '40%', // 80em+
  };
  const breakpointsM = {
    base: 5.5,
    md: 0,
    lg: 0,
    xl: 0,
  };

  return (
    <Box
      bg="#EDF1F8"
      h={breakpointsH}
      w={breakpointsW}
      borderWidth={1}
      borderRadius={5}
      m={breakpointsM}
    >
      <Flex>
        {route && (
          <Stack align="center">
            <Text>{route.name}</Text>
            <Text>{routeFormatDate(route.date)}</Text>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Donation ID</Th>
                    <Th>Number of Items</Th>
                    <Th>Pickup Status</Th>
                    <Th>Details</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {donations ? (
                    donations.map(d => {
                      return (
                        <Tr key={d.id}>
                          <Td>#{d.id}</Td>
                          <Td>{getFurnitureCount(d.furniture)}</Td>
                          <Td>
                            {d.status === PICKED_UP ? (
                              <Tag>
                                <Checkbox defaultChecked />
                              </Tag>
                            ) : (
                              <Tag>
                                <Checkbox
                                  onChange={() => {
                                    pickupComplete(d.id);
                                  }}
                                />
                              </Tag>
                            )}
                          </Td>
                          <Td>
                            <Button mr={5} ml={5} onClick={() => handleRowClick(d)}>
                              INFO
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <Center>
                      <Text>No Route Today</Text>
                      <Text>&apos;s Date</Text>
                    </Center>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
            <DonationModal data={donationData} onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
          </Stack>
        )}
        {!route && (
          <Center w="100%" h={breakpointsH}>
            <Flex direction="column" alignItems="center">
              <Heading>
                <Text color="grey">No Route Today</Text>
              </Heading>
              <Text color="grey">{routeFormatDate(new Date().toISOString())}</Text>
            </Flex>
          </Center>
        )}
      </Flex>
    </Box>
  );
};

export default TodayRoute;

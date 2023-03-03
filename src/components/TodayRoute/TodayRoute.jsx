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
} from '@chakra-ui/react';
import './TodayRoute.module.css';
import { PNPBackend } from '../../utils/utils';
import { makeDate } from '../../utils/InventoryUtils';

import { getCurrentUserId } from '../../utils/AuthUtils';
import DonationModal from '../InventoryPage/DonationModal';

const TodayRoute = () => {
  const [donations, setDonations] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});

  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  const getFurnitureCount = furniture => {
    return furniture.reduce((acc, { count }) => {
      return acc + count;
    }, 0);
  };

  const [route, setRoute] = useState();
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
      setRoute({ date: today, name: 'No Route Today' });
    }
  };

  useEffect(() => {
    getDonationsForToday();
  }, []);

  const pickupComplete = id => {
    PNPBackend.put(`/donations/${id}`, {
      status: 'archived',
    });
  };

  return (
    <Flex minH="100vh">
      {route && (
        <Stack align="center">
          <Text>{route.name}</Text>
          <Text>{makeDate(route.date)}</Text>
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
                  donations.map(d => (
                    <Tr key={d.id}>
                      <Td>#{d.id}</Td>
                      <Td>{getFurnitureCount(d.furniture)}</Td>
                      <Td>
                        {d.status === 'archived' ? (
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
                  ))
                ) : (
                  <Center>
                    <Text>No Routes to Display for Today&apos;s Date</Text>
                  </Center>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <DonationModal data={donationData} onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
        </Stack>
      )}
    </Flex>
  );
};

export default TodayRoute;
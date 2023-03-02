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

  const getFurnitureCount = furnitures => {
    let counter = 0;
    furnitures.forEach(ele => {
      counter += ele.count;
    });
    return counter;
  };

  const [route, setRoute] = useState();
  const getDonationsForToday = async () => {
    const userId = getCurrentUserId();
    const driverRoute = await PNPBackend.get(`/routes/driver/${userId}`);
    const today = '2023-02-16T08:00:00.000Z';
    const todayRoute = driverRoute.data.find(route3 => route3.date === today);
    const data = await PNPBackend.get(`/routes/${todayRoute.id}`);
    const donationInfo = data.data[0].donations;
    setRoute(route);
    setDonations(donationInfo);
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
      <Stack align="center">
        <Text>Irvine Route</Text>
        <Text>{makeDate(route && route.date)}</Text>
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
              {donations &&
                donations.map(d => (
                  <Tr key={d.id}>
                    {/* donation Id */}
                    <Td>#{d.id}</Td>
                    {/* number of items */}
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
                ))}
            </Tbody>
          </Table>
        </TableContainer>
        <DonationModal data={donationData} onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
      </Stack>
    </Flex>
  );
};

export default TodayRoute;

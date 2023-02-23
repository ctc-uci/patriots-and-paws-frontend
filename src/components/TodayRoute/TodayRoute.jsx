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
  // const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  const [route, setRoute] = useState();
  const getDonationsForToday = async () => {
    const userId = getCurrentUserId();
    const result = await PNPBackend.get(`/routes/driver/${userId}`);
    const today = '2023-02-16T08:00:00.000Z';
    const route2 = result.data.find(route3 => route3.date === today);
    const data = await PNPBackend.get(`/routes/${route2.id}`);
    setRoute(route2);
    const donations2 = data.data[0].donations;
    setDonations(donations2);
    // setUsers(donations2);
    // console.log(donations2);
  };

  useEffect(() => {
    getDonationsForToday();
  }, []);

  // const pickupComplete = () => {
  //   // TODO - change status in backend to archived

  // };

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
                    <Td>{d.orderNum}</Td>
                    <Td>
                      {d.status === 'archived' ? (
                        <Tag>
                          <Checkbox defaultChecked />
                        </Tag>
                      ) : (
                        <Tag>
                          <Checkbox />
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
        <DonationModal
          // setUsers={setUsers}
          data={donationData}
          onClose={onClose}
          onOpen={onOpen}
          isOpen={isOpen}
        />
      </Stack>
    </Flex>
  );
};

export default TodayRoute;

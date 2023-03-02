import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TableContainer,
  useDisclosure,
  Text,
  Tag,
} from '@chakra-ui/react';
import './InventoryPage.module.css';

import DonationModal from './DonationModal';
import {
  getDonationsFromDB,
  getRoutesFromDB,
  makeDate,
  colorMap,
} from '../../utils/InventoryUtils';

const InventoryPage = () => {
  const [allDonations, setAllDonations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [routes, setRoutes] = useState({});

  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  function makeStatus(status) {
    return (
      <Tag size="lg" colorScheme={colorMap[status]}>
        {status[0].toUpperCase() + status.slice(1)}
      </Tag>
    );
  }

  useEffect(() => {
    const fetchDonationsFromDB = async () => {
      const donationsFromDB = await getDonationsFromDB();
      setAllDonations(donationsFromDB);
    };
    fetchDonationsFromDB();
  }, []);

  useEffect(() => {
    const fetchRoutesFromDB = async () => {
      const routesFromDB = await getRoutesFromDB();
      const formattedRoutes = routesFromDB.map(({ id, name, date: day }) => ({
        id,
        name,
        date: new Date(day).toISOString().replace(/T.*$/, ''),
      }));
      const routesList = {};
      formattedRoutes.forEach(({ date }) => {
        routesList[date] = [];
      });
      formattedRoutes.forEach(({ id, name, date }) => routesList[date].push({ id, name }));
      setRoutes(routesList);
    };
    fetchRoutesFromDB();
  }, []);

  const makeUserRows = allDonations?.map(donation => {
    const { id, status, firstName, lastName, email, submittedDate } = donation;
    return (
      <Tr onClick={() => handleRowClick(donation)} key={id}>
        <Td>
          <Text>{`${firstName} ${lastName}`}</Text>
          <Text color="#718096">{email}</Text>
        </Td>
        <Td>#{id}</Td>
        <Td>{makeStatus(status)}</Td>
        <Td>{makeDate(submittedDate)}</Td>
      </Tr>
    );
  });

  return (
    <>
      <TableContainer p="122px">
        <Table variant="simple">
          <Thead>
            <Tr bg="#F7FAFC" height="40px">
              <Th>NAME</Th>
              <Th>DONATION ID</Th>
              <Th>STATUS</Th>
              <Th>SUBMISSION DATE</Th>
            </Tr>
          </Thead>
          <Tbody>{makeUserRows}</Tbody>
        </Table>
      </TableContainer>
      <DonationModal
        setAllDonations={setAllDonations}
        data={donationData}
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
        routes={routes}
      />
    </>
  );
};

export default InventoryPage;

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
  EMAILSTATUSES,
} from '../../utils/InventoryUtils';
// import STATUSES from '../../utils/config';

const InventoryPage = () => {
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [routes, setRoutes] = useState([]);

  const { PENDING, APPROVED, CHANGES_REQUESTED, SCHEDULED, ARCHIVED } = EMAILSTATUSES;

  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  function makeStatus(newStatus) {
    let color = 'gray';

    if (newStatus === 'rejected') {
      color = 'red';
    } else if (newStatus === APPROVED || newStatus === SCHEDULED) {
      color = 'green';
    } else if (newStatus === 'flagged' || newStatus === PENDING) {
      color = 'gray';
    } else if (newStatus === CHANGES_REQUESTED || newStatus === ARCHIVED) {
      color = 'blue';
    }
    return (
      <Tag size="lg" colorScheme={color}>
        {newStatus[0].toUpperCase() + newStatus.slice(1)}
      </Tag>
    );
  }

  // function makeDate(dateDB) {
  //   const d = new Date(dateDB);
  //   return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  // }

  useEffect(() => {
    const fetchDonationsFromDB = async () => {
      const donationsFromDB = await getDonationsFromDB();
      // console.log(donationsFromDB);
      setUsers(donationsFromDB);
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

  const makeUserRows = users.map(ele => {
    return (
      <Tr onClick={() => handleRowClick(ele)} key={ele.id}>
        <Td>
          <Text>{`${ele.firstName} ${ele.lastName}`}</Text>
          <Text color="#718096">{ele.email}</Text>
        </Td>
        <Td>#{ele.id}</Td>
        <Td>{makeStatus(ele.status)}</Td>
        <Td>{makeDate(ele.submittedDate)}</Td>
      </Tr>
    );
    // return <DonationModal key={ele.id} props={ele} />;
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
        setUsers={setUsers}
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

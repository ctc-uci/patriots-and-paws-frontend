import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Button,
  Tr,
  Td,
  Th,
  TableContainer,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import './InventoryPage.module.css';

import DonationModal from './DonationModal';
import { getDonationsFromDB, makeDate } from '../../utils/InventoryUtils';

const InventoryPage = () => {
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});

  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  function makeStatus(newStatus) {
    if (newStatus === 'denied') {
      return (
        <Button size="xs" colorScheme="red">
          Rejected
        </Button>
      );
    }
    if (newStatus === 'approved') {
      return (
        <Button size="xs" colorScheme="green">
          Approved
        </Button>
      );
    }
    if (newStatus === 'flagged') {
      return (
        <Button size="xs" colorScheme="gray">
          Flagged
        </Button>
      );
    }
    if (newStatus === 'pending') {
      return (
        <Button size="xs" colorScheme="gray">
          Pending
        </Button>
      );
    }
    if (newStatus === 'scheduled') {
      return (
        <Button size="xs" colorScheme="green">
          Scheduled
        </Button>
      );
    }
    if (newStatus === 'changes requested') {
      return (
        <Button size="xs" colorScheme="blue">
          Changes Requested
        </Button>
      );
    }
    if (newStatus === 'archived') {
      return (
        <Button size="xs" colorScheme="blue">
          Archived
        </Button>
      );
    }
    return (
      <Button size="xs" colorScheme="gray">
        {newStatus}
      </Button>
    );
  }

  // function makeDate(dateDB) {
  //   const d = new Date(dateDB);
  //   return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  // }

  useEffect(() => {
    const fetchDonationsFromDB = async () => {
      const donationsFromDB = await getDonationsFromDB();
      setUsers(donationsFromDB);
    };
    fetchDonationsFromDB();
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
      />
    </>
  );
};

export default InventoryPage;

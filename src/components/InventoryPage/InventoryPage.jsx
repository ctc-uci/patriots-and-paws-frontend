import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useDisclosure,
  Modal,
  Text,
} from '@chakra-ui/react';
import './InventoryPage.module.css';

import DonationModal from './DonationModal';
import getDonationsFromDB from '../../utils/InventoryUntils';

const InventoryPage = () => {
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const onOpen = true;
  // const isOpen = false;
  // const onClose = false;

  function makeStatus(status) {
    if (status === 'denied') {
      return (
        <Button size="xs" colorScheme="red">
          REJECTED
        </Button>
      );
    }
    if (status === 'approved') {
      return (
        <Button size="xs" colorScheme="green">
          APPROVED
        </Button>
      );
    }
    if (status === 'flagged') {
      return (
        <Button size="xs" colorScheme="gray">
          FLAGGED
        </Button>
      );
    }
    return (
      <Button size="xs" colorScheme="gray">
        {status}
      </Button>
    );
  }

  function makeDate(dateDB) {
    const d = new Date(dateDB);
    return `${d.getUTCMonth()}/${d.getUTCDay()} `;
  }

  useEffect(() => {
    const fetchDonationsFromDB = async () => {
      const donationsFromDB = await getDonationsFromDB();
      setUsers(donationsFromDB);
      // console.log(donationsFromDB);
    };
    fetchDonationsFromDB();
  }, []);

  const makeUserRows = users.map(ele => {
    return (
      <Tr onClick={onOpen} key={ele.id}>
        <Modal isOpen={isOpen} onClose={onClose}>
          <DonationModal props={ele} onClose={onClose} />
        </Modal>

        <Td>
          <Text>{`${ele.firstName} ${ele.lastName}`}</Text>
          <Text color="#718096">{ele.email}</Text>
        </Td>
        <Td>#{ele.id}</Td>
        <Td>{makeStatus(ele.status)}</Td>
        <Td>{makeDate(ele.submittedDate)}</Td>
      </Tr>
    );
  });

  return (
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
  );
};

export default InventoryPage;

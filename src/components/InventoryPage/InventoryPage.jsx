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
import { makeDate } from '../../utils/InventoryUtils';
import PaginationFooter from '../PaginationFooter/PaginationFooter';
import { PNPBackend } from '../../utils/utils';

const InventoryPage = () => {
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [count, setCount] = useState();

  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  function makeStatus(newStatus) {
    if (newStatus === 'denied') {
      return (
        <Button size="xs" colorScheme="red">
          REJECTED
        </Button>
      );
    }
    if (newStatus === 'approved') {
      return (
        <Button size="xs" colorScheme="green">
          APPROVED
        </Button>
      );
    }
    if (newStatus === 'flagged') {
      return (
        <Button size="xs" colorScheme="gray">
          FLAGGED
        </Button>
      );
    }
    return (
      <Button size="xs" colorScheme="gray">
        {newStatus}
      </Button>
    );
  }

  const getTotalCount = async () => {
    const { data } = await PNPBackend.get(`donations/total`);
    const { count: totalCount } = data[0];
    setCount(totalCount);
  };

  useEffect(() => {
    getTotalCount();
  }, []);

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
          <Tbody>
            {users.map(ele => (
              <Tr onClick={() => handleRowClick(ele)} key={ele.id}>
                <Td>
                  <Text>{`${ele.firstName} ${ele.lastName}`}</Text>
                  <Text color="#718096">{ele.email}</Text>
                </Td>
                <Td>#{ele.id}</Td>
                <Td>{makeStatus(ele.status)}</Td>
                <Td>{makeDate(ele.submittedDate)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {count && <PaginationFooter count={count} setData={setUsers} table="donations" />}
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

import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import './InventoryPage.module.css';

import DonationModal from './DonationModal';
import { getDonationsFromDB } from '../../utils/InventoryUntils';

const InventoryPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchDonationsFromDB = async () => {
      const donationsFromDB = await getDonationsFromDB();
      setUsers(donationsFromDB);
      // console.log(donationsFromDB);
    };
    fetchDonationsFromDB();
  }, []);

  const makeUserRows = users.map(ele => {
    return <DonationModal key={ele.id} props={ele} />;
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

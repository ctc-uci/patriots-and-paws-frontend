import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  useDisclosure,
  Modal,
} from '@chakra-ui/react';

import DonationModal from './DonationModal';

const InventoryPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function makeStatus(status) {
    return (
      <Flex
      // bg={
      //   status === 'rejected'
      //     ? 'red'
      //     : status === 'flagged'
      //     ? 'gray'
      //     : status === 'approved'
      //     ? 'green'
      //     : 'white'
      // }
      >
        {status}
      </Flex>
    );
  }

  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Donation Information</TableCaption>
        <Thead>
          <Tr>
            <Th>NAME</Th>
            <Th>DONATION ID</Th>
            <Th>STATUS</Th>
            <Th>SUBMISSION DATE</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr onClick={onOpen}>
            <Modal isOpen={isOpen} onClose={onClose}>
              <DonationModal onClose={onClose} />
            </Modal>

            <Td>
              <h1>name</h1>
              <h1>email</h1>
            </Td>
            <Td>#123</Td>
            <Td>{makeStatus('rejected')}</Td>
          </Tr>
          <Tr>
            <Td>feet</Td>
            <Td>centimetres (cm)</Td>
            <Td isNumeric>30.48</Td>
            <Td isNumeric>30.48</Td>
          </Tr>
          <Tr>
            <Td>yards</Td>
            <Td>metres (m)</Td>
            <Td isNumeric>0.91444</Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default InventoryPage;

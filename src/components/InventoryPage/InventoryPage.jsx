import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  useDisclosure,
  Modal,
  Text,
} from '@chakra-ui/react';
import './InventoryPage.module.css';

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
          <Tr onClick={onOpen}>
            <Modal isOpen={isOpen} onClose={onClose}>
              <DonationModal onClose={onClose} />
            </Modal>

            <Td>
              <Text>Zoya Soy</Text>
              <Text color="#718096">zsoy@uci.edu</Text>
            </Td>
            <Td>#3939483</Td>
            <Td>{makeStatus('rejected')}</Td>
            <Td>January 10th, 2023</Td>
          </Tr>

          <Tr onClick={onOpen}>
            {/* <Modal isOpen={isOpen} onClose={onClose}>
              <DonationModal onClose={onClose} />
            </Modal> */}

            <Td>
              <Text>Zoya Soy</Text>
              <Text color="#718096">zsoy@uci.edu</Text>
            </Td>
            <Td>#3939483</Td>
            <Td>{makeStatus('rejected')}</Td>
            <Td>January 10th, 2023</Td>
          </Tr>

          <Tr onClick={onOpen}>
            {/* <Modal isOpen={isOpen} onClose={onClose}>
              <DonationModal onClose={onClose} />
            </Modal> */}

            <Td>
              <Text>Zoya Soy</Text>
              <Text color="#718096">zsoy@uci.edu</Text>
            </Td>
            <Td>#3939483</Td>
            <Td>{makeStatus('rejected')}</Td>
            <Td>January 10th, 2023</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default InventoryPage;

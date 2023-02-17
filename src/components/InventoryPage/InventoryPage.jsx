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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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

  // const makeUserRows = users.map(ele => {
  //   console.log(ele);
  //   return (
  //     <Tr onClick={() => handleRowClick(ele)} key={ele.id}>
  //       <Td>
  //         <Text>{`${ele.firstName} ${ele.lastName}`}</Text>
  //         <Text color="#718096">{ele.email}</Text>
  //       </Td>
  //       <Td>#{ele.id}</Td>
  //       <Td>{makeStatus(ele.status)}</Td>
  //       <Td>{makeDate(ele.submittedDate)}</Td>
  //     </Tr>
  //   );
  //   // return <DonationModal key={ele.id} props={ele} />;
  // });

  const makePendingUserRows = users
    .filter(ele => ele.status === 'pending' || ele.status === 'changes requested')
    .map(ele => {
      console.log(ele);
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
    });

  const makeDonorApprovalUserRows = users
    .filter(ele => ele.status === 'approved' || ele.status === 'scheduling')
    .map(ele => {
      console.log(ele);
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
    });

  const makeAwaitingUserRows = users
    .filter(ele => ele.status === 'scheduled')
    .map(ele => {
      console.log(ele);
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
    });

  const makeArchivedUserRows = users
    .filter(ele => ele.status === 'archived')
    .map(ele => {
      console.log(ele);
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
    });

  return (
    <>
      <Tabs p="40px">
        <TabList>
          <Tab>Pending</Tab>
          <Tab>Waiting for Donor Approval</Tab>
          <Tab>Awaiting Pickup</Tab>
          <Tab>Archived</Tab>
        </TabList>

        {/* pending columns: name, donation id, status, submission date
            waiting columns: name, donation id, route, scheduled date
            awaiting pickup columns: name, donation id, route, pickup date
            archived columns: name, donation id, status, pickup date */}

        <TabPanels>
          <TabPanel>
            <TableContainer p="40px">
              <Table variant="simple">
                <Thead>
                  <Tr bg="#F7FAFC" height="40px">
                    <Th>NAME</Th>
                    <Th>DONATION ID</Th>
                    <Th>STATUS</Th>
                    <Th>SUBMISSION DATE</Th>
                  </Tr>
                </Thead>
                <Tbody>{makePendingUserRows}</Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <TableContainer p="40px">
              <Table variant="simple">
                <Thead>
                  <Tr bg="#F7FAFC" height="40px">
                    <Th>NAME</Th>
                    <Th>DONATION ID</Th>
                    <Th>ROUTE</Th>
                    <Th>SCHEDULED DATE</Th>
                  </Tr>
                </Thead>
                <Tbody>{makeDonorApprovalUserRows}</Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <TableContainer p="40px">
              <Table variant="simple">
                <Thead>
                  <Tr bg="#F7FAFC" height="40px">
                    <Th>NAME</Th>
                    <Th>DONATION ID</Th>
                    <Th>ROUTE</Th>
                    <Th>PICKUP DATE</Th>
                  </Tr>
                </Thead>
                <Tbody>{makeAwaitingUserRows}</Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <TableContainer p="40px">
              <Table variant="simple">
                <Thead>
                  <Tr bg="#F7FAFC" height="40px">
                    <Th>NAME</Th>
                    <Th>DONATION ID</Th>
                    <Th>STATUS</Th>
                    <Th>PICKUP DATE</Th>
                  </Tr>
                </Thead>
                <Tbody>{makeArchivedUserRows}</Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
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

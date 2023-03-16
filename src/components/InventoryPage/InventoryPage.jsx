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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Tag,
  TagLabel,
} from '@chakra-ui/react';

import DonationModal from './DonationModal';
import RouteCalendar from '../RouteCalendar/RouteCalendar';
import PaginationFooter from '../PaginationFooter/PaginationFooter';
import { PNPBackend } from '../../utils/utils';
import { getRoutesFromDB, makeDate, colorMap } from '../../utils/InventoryUtils';
import { STATUSES } from '../../utils/config';

const { PENDING, CHANGES_REQUESTED, SCHEDULING, SCHEDULED, PICKED_UP, RESCHEDULE } = STATUSES;

const InventoryPage = () => {
  const [allDonations, setAllDonations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [count, setCount] = useState();
  const [routes, setRoutes] = useState({});
  const [tabIndex, setTabIndex] = useState(0);

  const tabStatuses = [
    [PENDING, CHANGES_REQUESTED, RESCHEDULE],
    [SCHEDULING],
    [SCHEDULED],
    [PICKED_UP],
  ];

  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  const makeStatus = status => {
    return (
      <Tag size="sm" mt={3} ml={15} color="white" bgColor={colorMap[status]}>
        <TagLabel fontSize={14} color="white">
          {status.toUpperCase()}
        </TagLabel>
      </Tag>
    );
  };

  const getTotalCount = async () => {
    const { data } = await PNPBackend.get(`donations/total`);
    const { count: totalCount } = data[0];
    setCount(totalCount);
  };

  useEffect(() => {
    getTotalCount();
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

  const makeDonationRows = () => {
    return allDonations
      .filter(ele => tabStatuses[tabIndex].includes(ele.status))
      .map(ele => {
        return (
          <Tr
            onClick={() => handleRowClick(ele)}
            key={ele.id}
            cursor="pointer"
            _hover={{
              background: 'blue.50',
            }}
          >
            <Td>
              <Text>{`${ele.firstName} ${ele.lastName}`}</Text>
            </Td>
            <Td>#{ele.id}</Td>
            {tabIndex === 0 ? (
              <>
                <Td>{makeStatus(ele.status)}</Td>
                <Td>{makeDate(ele.submittedDate)}</Td>
              </>
            ) : (
              <>
                <Td>{ele.addressCity}</Td>
                <Td>{makeDate(ele.pickupDate)}</Td>
              </>
            )}
          </Tr>
        );
      });
  };

  // useEffect(() => {
  //   makeUserRows;
  // }, [allDonations]);

  return (
    <>
      <Tabs p="40px" onChange={index => setTabIndex(index)}>
        <TabList>
          <Tab>Pending Admin Approval</Tab>
          <Tab>Pending Donor Approval</Tab>
          <Tab>Awaiting Pickup</Tab>
          <Tab>Archive</Tab>
          <Button onClick={onDrawerOpen}>Open Calendar</Button>
        </TabList>
        <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose} size="full">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />

            <DrawerBody>
              <RouteCalendar />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

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
                <Tbody>{makeDonationRows()}</Tbody>
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
                <Tbody>{makeDonationRows()}</Tbody>
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
                <Tbody>{makeDonationRows()}</Tbody>
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
                <Tbody>{makeDonationRows()}</Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          {count && <PaginationFooter count={count} setData={setAllDonations} table="donations" />}
        </TabPanels>
      </Tabs>
      <DonationModal
        setAllDonations={setAllDonations}
        data={donationData}
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
        routes={routes}
        // deleteDonation={deleteDonation}
      />
    </>
  );
};

export default InventoryPage;

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
  TabIndicator,
  Flex,
  Image,
  Center,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import peopleIcon from '../../assets/Bold.svg';
import donationIdIcon from '../../assets/donationId.svg';
import clockIcon from '../../assets/clock.svg';
import DonationModal from './DonationModal';
import RouteCalendar from '../RouteCalendar/RouteCalendar';
import PaginationFooter from '../PaginationFooter/PaginationFooter';
import {
  getRoutesFromDB,
  makeDate,
  statusColorMap,
  displayStatuses,
} from '../../utils/InventoryUtils';

const InventoryPage = () => {
  const [donations, setDonations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [routes, setRoutes] = useState({});
  const [tabIndex, setTabIndex] = useState(0);

  const tabStatuses = ['admin', 'donor', 'pickup', 'archive'];

  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  const makeStatus = status => {
    return (
      <Tag size="sm" variant="solid" py="5px" colorScheme={statusColorMap[status]}>
        <TagLabel fontSize="18px" fontWeight={600}>
          {displayStatuses[status]}
        </TagLabel>
      </Tag>
    );
  };

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
    return donations.map(ele => {
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
            <Text fontSize="18px">{`${ele.firstName} ${ele.lastName}`}</Text>
          </Td>
          <Td fontSize="18px">#{ele.id}</Td>
          {tabIndex === 0 ? (
            <>
              <Td fontSize="18px">{makeStatus(ele.status)}</Td>
              <Td fontSize="18px">{makeDate(ele.submittedDate)}</Td>
            </>
          ) : (
            <>
              <Td fontSize="18px">{ele.addressCity}</Td>
              <Td fontSize="18px">{makeDate(ele.pickupDate)}</Td>
            </>
          )}
        </Tr>
      );
    });
  };

  return (
    <>
      <div className="main-body">
        <Tabs p="20px" variant="unstyled" h="75vh" onChange={index => setTabIndex(index)}>
          <TabList mt="2vh" px="20px" justifyContent="space-between">
            <Flex>
              <Tab _selected={{ color: 'blue.500' }}>Pending Admin Approval</Tab>
              <Tab _selected={{ color: 'blue.500' }}>Pending Donor Approval</Tab>
              <Tab _selected={{ color: 'blue.500' }}>Awaiting Pickup</Tab>
              <Tab _selected={{ color: 'blue.500' }}>Archive</Tab>
            </Flex>
            <Button onClick={onDrawerOpen} colorScheme="teal">
              Open Calendar
            </Button>
          </TabList>
          <TabIndicator mt="-1.5px" height="2px" bg="blue.500" borderRadius="1px" />
          <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose} size="full">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />

              <DrawerBody p="2em">
                <Center>
                  <RouteCalendar />
                </Center>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <TabPanels mt="2vh">
            <TabPanel>
              <TableContainer ml={1} overflowY="auto" height="58vh">
                <Table border="solid" borderWidth="1px" borderColor="#E2E8F0">
                  <Thead position="sticky" top={0}>
                    <Tr bg="#F7FAFC" height="40px">
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={peopleIcon} mr={2} color="black" /> NAME
                        </Flex>
                      </Th>
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={donationIdIcon} mr={2} color="black" /> DONATION ID
                        </Flex>
                      </Th>
                      <Th width="25%">
                        <Flex align="center">
                          <CheckCircleIcon mr={2} color="black" /> STATUS
                        </Flex>
                      </Th>
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={clockIcon} mr={2} color="black" /> SUBMISSION DATE
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>{makeDonationRows()}</Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel>
              <TableContainer ml={1} overflowY="auto" height="58vh">
                <Table border="solid" borderWidth="1px" borderColor="#E2E8F0">
                  <Thead position="sticky" top={0}>
                    <Tr bg="#F7FAFC" height="40px">
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={peopleIcon} mr={2} color="black" /> NAME
                        </Flex>
                      </Th>
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={donationIdIcon} mr={2} color="black" /> DONATION ID
                        </Flex>
                      </Th>
                      <Th width="25%">ROUTE</Th>
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={clockIcon} mr={2} color="black" /> SCHEDULED DATE
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>{makeDonationRows()}</Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel>
              <TableContainer ml={1} overflowY="auto" height="58vh">
                <Table border="solid" borderWidth="1px" borderColor="#E2E8F0">
                  <Thead position="sticky" top={0}>
                    <Tr bg="#F7FAFC" height="40px">
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={peopleIcon} mr={2} color="black" /> NAME
                        </Flex>
                      </Th>
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={donationIdIcon} mr={2} color="black" /> DONATION ID
                        </Flex>
                      </Th>
                      <Th width="25%">ROUTE</Th>
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={clockIcon} mr={2} color="black" /> PICKUP DATE
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>{makeDonationRows()}</Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel>
              <TableContainer ml={1} overflowY="auto" height="58vh">
                <Table border="solid" borderWidth="1px" borderColor="#E2E8F0">
                  <Thead position="sticky" top={0}>
                    <Tr bg="#F7FAFC" height="40px">
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={peopleIcon} mr={2} color="black" /> NAME
                        </Flex>
                      </Th>
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={donationIdIcon} mr={2} color="black" /> DONATION ID
                        </Flex>
                      </Th>
                      <Th width="25%">ROUTE</Th>
                      <Th width="25%">
                        <Flex align="center">
                          <Image src={clockIcon} mr={2} color="black" /> DATE PICKED UP
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>{makeDonationRows()}</Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <Tabs px="20px" variant="unstyled">
        <PaginationFooter
          setData={setDonations}
          table="donations"
          tab={tabStatuses[tabIndex]}
          position="sticky"
        />
      </Tabs>
      <DonationModal
        setAllDonations={setDonations}
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

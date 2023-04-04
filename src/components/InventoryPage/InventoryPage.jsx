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
} from '@chakra-ui/react';
import { CheckCircleIcon, ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import peopleIcon from '../../assets/Bold.svg';
import donationIdIcon from '../../assets/donationId.svg';
import clockIcon from '../../assets/clock.svg';
import DonationModal from './DonationModal';
import RouteCalendar from '../RouteCalendar/RouteCalendar';
import PaginationFooter from '../PaginationFooter/PaginationFooter';
import { PNPBackend } from '../../utils/utils';
import {
  getRoutesFromDB,
  makeDate,
  statusColorMap,
  displayStatuses,
} from '../../utils/InventoryUtils';
import { STATUSES } from '../../utils/config';

const {
  PENDING,
  CHANGES_REQUESTED,
  SCHEDULING,
  SCHEDULED,
  PICKED_UP,
  RESCHEDULE,
  APPROVAL_REQUESTED,
} = STATUSES;

const InventoryPage = () => {
  const [allDonations, setAllDonations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [count, setCount] = useState();
  const [routes, setRoutes] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [submissionDateSortDesc, setSubmissionDateSortDesc] = useState(true);

  const tabStatuses = [
    [PENDING, CHANGES_REQUESTED, RESCHEDULE, APPROVAL_REQUESTED],
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
      <Tag size="sm" variant="solid" mt={3} ml={15} colorScheme={statusColorMap[status]}>
        <TagLabel fontSize={14}>{displayStatuses[status]}</TagLabel>
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

  return (
    <>
      <Tabs p="40px" variant="unstyled" onChange={index => setTabIndex(index)}>
        <TabList justifyContent="space-between">
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

            <DrawerBody>
              <RouteCalendar />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <TabPanels>
          <TabPanel>
            <TableContainer py="1.5em">
              <Table variant="simple">
                <Thead>
                  <Tr bg="#F7FAFC" height="40px">
                    <Th>
                      <Flex align="center">
                        <Image src={peopleIcon} mr={2} color="black" /> NAME
                      </Flex>
                    </Th>
                    <Th>
                      <Flex align="center">
                        <Image src={donationIdIcon} mr={2} color="black" /> DONATION ID
                      </Flex>
                    </Th>
                    <Th>
                      <Flex align="center">
                        <CheckCircleIcon mr={2} color="black" /> STATUS
                      </Flex>
                    </Th>
                    <Th
                      _hover={{ cursor: 'pointer' }}
                      onClick={() => setSubmissionDateSortDesc(!submissionDateSortDesc)}
                    >
                      <Flex gap={2} align="center">
                        <Image src={clockIcon} mr={2} color="black" /> SUBMISSION DATE{' '}
                        {submissionDateSortDesc ? <ArrowDownIcon /> : <ArrowUpIcon />}
                      </Flex>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>{makeDonationRows()}</Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <TableContainer py="1.5em">
              <Table variant="simple">
                <Thead>
                  <Tr bg="#F7FAFC" height="40px">
                    <Th>
                      <Flex align="center">
                        <Image src={peopleIcon} mr={2} color="black" /> NAME
                      </Flex>
                    </Th>
                    <Th>
                      <Flex align="center">
                        <Image src={donationIdIcon} mr={2} color="black" /> DONATION ID
                      </Flex>
                    </Th>
                    <Th>ROUTE</Th>
                    <Th>
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
            <TableContainer py="1.5em">
              <Table variant="simple">
                <Thead>
                  <Tr bg="#F7FAFC" height="40px">
                    <Th>
                      <Flex align="center">
                        <Image src={peopleIcon} mr={2} color="black" /> NAME
                      </Flex>
                    </Th>
                    <Th>
                      <Flex align="center">
                        <Image src={donationIdIcon} mr={2} color="black" /> DONATION ID
                      </Flex>
                    </Th>
                    <Th>ROUTE</Th>
                    <Th>
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
            <TableContainer py="1.5em">
              <Table variant="simple">
                <Thead>
                  <Tr bg="#F7FAFC" height="40px">
                    <Th>
                      <Flex align="center">
                        <Image src={peopleIcon} mr={2} color="black" /> NAME
                      </Flex>
                    </Th>
                    <Th>
                      <Flex align="center">
                        <Image src={donationIdIcon} mr={2} color="black" /> DONATION ID
                      </Flex>
                    </Th>
                    <Th>ROUTE</Th>
                    <Th>
                      <Flex align="center">
                        <Image src={clockIcon} mr={2} color="black" /> DATE PICKED DATE
                      </Flex>
                    </Th>
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
      />
    </>
  );
};

export default InventoryPage;

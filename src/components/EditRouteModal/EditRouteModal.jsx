import React, { useEffect, useState } from 'react';
import { PropTypes, instanceOf } from 'prop-types';
import {
  Flex,
  List,
  ListItem,
  Card,
  Text,
  Button,
  Stack,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  Heading,
  FormControl,
  Select,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useDisclosure,
  useBreakpoint,
} from '@chakra-ui/react';
import { DragHandleIcon } from '@chakra-ui/icons';
import { PDFViewer } from '@react-pdf/renderer';
import { Reorder } from 'framer-motion';
import RoutePDF from '../RoutePDF/RoutePDF';
import {
  updateDonation,
  getRoute,
  updateRoute,
  routePDFStyles,
  dateHasPassed,
} from '../../utils/RouteUtils';
import { handleNavigateToAddress } from '../../utils/utils';
import { AUTH_ROLES, STATUSES } from '../../utils/config';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES;

const { SCHEDULING } = STATUSES;

const DonationList = ({
  isAdminView,
  isEditing,
  donations,
  setDonations,
  getConfirmedDonations,
}) => {
  const listComponentProps = {
    as: Reorder.Group,
    styleType: 'decimal',
    onReorder: setDonations,
    paddingLeft: '1em',
  };

  const itemComponentProps = {
    as: Reorder.Item,
    dragTransition: { bounceStiffness: 600 },
    initial: 'notDragging',
    whileDrag: 'dragging',
    position: 'relative',
    cursor: 'move',
    paddingLeft: '1em',
  };

  return (
    <List spacing={5} axis="y" values={donations} {...(isEditing && listComponentProps)}>
      {getConfirmedDonations().map(donation => (
        <ListItem
          key={donation.id}
          value={donation}
          as={isEditing && Reorder.Item}
          {...(isEditing && itemComponentProps)}
        >
          <Flex alignItems="center" justifyContent="space-between">
            <Card
              backgroundColor="white"
              border="solid"
              borderWidth={1}
              borderColor={donation.status === SCHEDULING || isAdminView ? 'gray.200' : 'blue.500'}
              p="0.7em 1.7em"
              fontSize="1em"
              width="100%"
              borderRadius={10}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  {isEditing && <DragHandleIcon mr={5} />}
                  <Stack spacing={0}>
                    <Text fontWeight="bold">Donation #{donation.id}</Text>
                    <Text isTruncated>
                      {donation.firstName} {donation.lastName} | Items:&nbsp;
                      {donation.furniture.length ? donation.furniture.length : 0}
                    </Text>
                  </Stack>
                </Flex>
                <Popover placement="left">
                  <PopoverTrigger>
                    <Button colorScheme="teal" size="sm">
                      Show Address
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent bg="#171923" color="white">
                    <PopoverArrow bg="#171923" />
                    <PopoverBody>
                      {donation.addressUnit
                        ? `${donation.addressStreet}, Unit ${donation.addressUnit}`
                        : donation.addressStreet}
                      , {donation.addressCity}, CA {donation.addressZip}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
            </Card>
          </Flex>
        </ListItem>
      ))}
    </List>
  );
};

const EditRouteModal = ({ cookies, routeId, allDrivers, setAllDrivers, isOpen, onClose, role }) => {
  const [assignedDriverId, setAssignedDriverId] = useState('');
  const [route, setRoute] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [assignedRouteName, setAssignedRouteName] = useState('');
  const [donations, setDonations] = useState([]);
  const [modalState, setModalState] = useState('view');
  const { isOpen: exportIsOpen, onOpen: exportOnOpen, onClose: exportOnClose } = useDisclosure();
  const [confirmedState, setConfirmedState] = useState('inactive');
  const [userRole, setUserRole] = useState();
  const [originalDriverId, setOriginalDriverId] = useState();
  const [routeDate, setRouteDate] = useState(new Date());
  const breakpointSize = useBreakpoint();

  const fetchDonations = async () => {
    const routeFromDB = await getRoute(routeId);
    const routeDateFromDB = new Date(routeFromDB.date);
    setRouteDate(routeDateFromDB);
    setRoute(routeFromDB);
    const { driverId } = routeFromDB;
    setAssignedDriverId(driverId);
    setOriginalDriverId(driverId);
    setAssignedRouteName(routeFromDB.name);
    setDonations(routeFromDB.donations ?? []);
    const filteredDrivers = allDrivers.filter(
      ({ id, assignedRoutes }) =>
        id === driverId || !assignedRoutes.includes(routeDateFromDB.toISOString().split('T')[0]),
    );
    setDrivers(filteredDrivers);
  };

  useEffect(() => {
    setUserRole(cookies.get(cookieKeys.ROLE));
  }, []);

  useEffect(() => {
    if (routeId) {
      fetchDonations();
    }
  }, [routeId]);

  // convert date to 'Weekday, Month Day' format
  const convertDate = date => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Los_Angeles',
    });
    return formattedDate;
  };

  const handleDriverChange = e => {
    setAssignedDriverId(e.target.value);
  };

  const updateDriverRoutes = () => {
    if (originalDriverId) {
      const { assignedRoutes } = allDrivers.find(d => d.id === originalDriverId);
      const updatedDrivers = allDrivers.map(ele =>
        ele.id === originalDriverId
          ? {
              ...ele,
              assignedRoutes: assignedRoutes.filter(d => d !== routeDate),
            }
          : ele,
      );
      setAllDrivers(updatedDrivers);
    }
    if (assignedDriverId) {
      const { assignedRoutes } = allDrivers.find(d => d.id === assignedDriverId);
      assignedRoutes.push(routeDate.toISOString().split('T')[0]);
    }
  };

  const handleSave = async () => {
    setModalState('view');
    try {
      const updatedRoute = Object.assign(route, { driverId: assignedDriverId });
      await updateRoute(updatedRoute);

      const updatedDonations = donations.map((donation, index) =>
        Object.assign(donation, { orderNum: index + 1 }),
      );

      // this updates donations in parallel
      const updateDonationPromises = updatedDonations.map(donation => updateDonation(donation));
      await Promise.all(updateDonationPromises);
      updateDriverRoutes();
    } catch (err) {
      // TODO handle error
    }
  };

  const [originalOrder, setOriginalOrder] = useState([]);
  const handleCancel = () => {
    setModalState('view');
    setDonations(originalOrder);
  };

  const handleChangeToEdit = () => {
    setConfirmedState('inactive');
    setModalState('edit');
    setOriginalOrder(donations);
  };

  const handleConfirmedToggle = () => {
    if (confirmedState === 'inactive') {
      setConfirmedState('active');
    } else {
      setConfirmedState('inactive');
    }
  };

  const getConfirmedDonations = () => {
    if (confirmedState === 'active') {
      return donations.filter(ele => ele.status !== SCHEDULING);
    }
    return donations;
  };

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={() => {
        setConfirmedState('inactive');
        setModalState('view');
        onClose();
        setModalState('view');
      }}
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent p="1em" h="80vh">
        <ModalHeader>
          <Stack>
            <Heading as="h4" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
              {assignedRouteName}
            </Heading>
            <Flex justifyContent="space-between">
              <Text fontSize="md" fontWeight="normal" isTruncated>
                {convertDate(routeDate)}
              </Text>
            </Flex>
            <Flex direction="row" gap={5} justify="space-between">
              <FormControl isRequired>
                <Select
                  isDisabled={modalState === 'view'}
                  variant="outline"
                  size="sm"
                  width="80%"
                  value={assignedDriverId ?? ''}
                  placeholder="Select Driver"
                  onChange={handleDriverChange}
                >
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl display="flex" whiteSpace="nowrap" alignItems="center">
                <Text fontSize="sm" fontWeight="normal" mr={3} isTruncated>
                  Show confirmed donations only
                </Text>
                <Switch
                  id="confirmed-donations"
                  onChange={handleConfirmedToggle}
                  isDisabled={
                    modalState === 'edit' || donations.length === 0 || dateHasPassed(routeDate)
                  }
                  isChecked={modalState !== 'edit' && confirmedState === 'active'}
                />
              </FormControl>
            </Flex>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {donations.length === 0 ? (
            <Flex
              textAlign="center"
              color="blackAlpha.600"
              m="auto"
              h="100%"
              justify="center"
              direction="column"
            >
              <Text fontSize="1.75em" fontWeight="bold">
                No Donations Added Yet
              </Text>
              <Text fontSize="0.8em" isTruncated>
                {userRole === DRIVER_ROLE
                  ? 'Contact the Patriots and Paws Admin for more information.'
                  : 'You can add donations to a route when scheduling'}
              </Text>
            </Flex>
          ) : (
            <DonationList
              isAdminView={userRole === ADMIN_ROLE}
              isEditing={modalState === 'edit'}
              donations={donations}
              setDonations={setDonations}
              getConfirmedDonations={getConfirmedDonations}
            />
          )}
        </ModalBody>
        <ModalFooter>
          {modalState === 'edit' && (
            <Flex direction="row" justify="right" alignItems="center" width="100%" spacing={5}>
              <Flex justify="left" gap={2}>
                <Button colorScheme="gray" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button colorScheme="blue" type="submit" onClick={handleSave}>
                  Save changes
                </Button>
              </Flex>
            </Flex>
          )}
          {modalState === 'view' && (
            <Flex
              direction="row"
              justify="space-between"
              alignItems="center"
              width="100%"
              spacing={5}
            >
              <Flex justify="left" gap={2}>
                <Button
                  colorScheme="blackAlpha"
                  type="submit"
                  onClick={exportOnOpen}
                  isDisabled={breakpointSize === 'base' || donations.length === 0}
                >
                  Export PDF
                </Button>
                <Modal isOpen={exportIsOpen} onClose={exportOnClose} size="full">
                  <ModalContent>
                    <ModalCloseButton />
                    <ModalBody p="5em 5em 0 5em">
                      <PDFViewer style={routePDFStyles.viewer}>
                        <RoutePDF
                          driverData={drivers.find(driver => driver.id === assignedDriverId)}
                          donationData={getConfirmedDonations()}
                          date={routeDate}
                        />
                      </PDFViewer>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                <Button
                  colorScheme="teal"
                  type="submit"
                  onClick={() => handleNavigateToAddress(getConfirmedDonations())}
                  isDisabled={donations.length === 0}
                >
                  Navigate to Route
                </Button>
              </Flex>
              {(role === ADMIN_ROLE || role === SUPERADMIN_ROLE) && (
                <Button
                  colorScheme="blue"
                  type="submit"
                  justify="right"
                  onClick={handleChangeToEdit}
                  isDisabled={dateHasPassed(routeDate)}
                >
                  Edit Routes
                </Button>
              )}
            </Flex>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

EditRouteModal.propTypes = {
  routeId: PropTypes.string,
  role: PropTypes.string,
  allDrivers: PropTypes.instanceOf(Array).isRequired,
  setAllDrivers: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

EditRouteModal.defaultProps = {
  routeId: '',
  role: '',
};

DonationList.propTypes = {
  isAdminView: PropTypes.bool,
  isEditing: PropTypes.bool,
  donations: PropTypes.instanceOf(Array),
  setDonations: PropTypes.func.isRequired,
  getConfirmedDonations: PropTypes.func.isRequired,
};

DonationList.defaultProps = {
  isAdminView: false,
  isEditing: false,
  donations: [],
};

export default withCookies(EditRouteModal);

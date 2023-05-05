/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Flex, useDisclosure, Button, Heading } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CreateRouteModal from '../CreateRouteModal/CreateRouteModal';
import { getCurrentUserId, getUserFromDB } from '../../utils/AuthUtils';
import EditRouteModal from '../EditRouteModal/EditRouteModal';
import { AUTH_ROLES, STATUSES } from '../../utils/config';
import { getAllRoutes, getDrivers } from '../../utils/RouteUtils';

const { DRIVER_ROLE } = AUTH_ROLES;
const { SCHEDULING } = STATUSES;

const pastRoutes = {
  backgroundColor: 'transparent',
  textColor: '#718096', // gray.500
  borderColor: '#718096', // gray.500
};

const blueRoute = {
  backgroundColor: '#2B6CB0', // blue.600
  textColor: 'white',
  borderColor: '#2B6CB0', // blue.600
};

const grayRoute = {
  backgroundColor: 'RGBA(0, 0, 0, 0.36)', // blackAlpha.500
  textColor: 'white',
  borderColor: 'RGBA(0, 0, 0, 0.36)',
};

const RouteCalendar = () => {
  const [role, setRole] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [selectedEventDate, setSelectedEventDate] = useState();
  const [selectedRouteId, setSelectedRouteId] = useState();
  // const [overflow, setOverflow] = useState('visible');
  const calendarRef = useRef(null);

  // for CreateRouteModal
  const {
    isOpen: createRouteIsOpen,
    onOpen: createRouteOnOpen,
    onClose: createRouteOnClose,
  } = useDisclosure();

  // for EditRouteModal
  const {
    isOpen: editRouteIsOpen,
    onOpen: editRouteOnOpen,
    onClose: editRouteOnClose,
  } = useDisclosure();

  const getEventDisplayStyle = (userRole, currentUserId, driverId, date, donations) => {
    const currentDate = new Date();
    const currRouteDate = new Date(date);

    if (currRouteDate < currentDate) {
      return pastRoutes;
    }

    if (userRole === DRIVER_ROLE) {
      if (currentUserId === driverId) {
        return blueRoute;
      }
      return grayRoute;
    }

    const isUnconfirmedRoute =
      donations.length === 0 || donations.some(({ status }) => status === SCHEDULING);
    if (isUnconfirmedRoute) {
      return grayRoute;
    }
    return blueRoute;
  };

  useEffect(() => {
    const fetchAllRoutesAndDrivers = async () => {
      const currentUserId = getCurrentUserId();
      const currentUser = await getUserFromDB(currentUserId);
      const { role: userRole } = currentUser;
      setRole(userRole);
      const [routesFromDB, driversFromDB] = await Promise.all([getAllRoutes(), getDrivers()]);
      const eventsList = routesFromDB.map(({ id, name, date, driverId, donations }) => ({
        id,
        title: name,
        start: new Date(date).toISOString().replace(/T.*$/, ''),
        allDay: true,
        ...getEventDisplayStyle(userRole, currentUserId, driverId, date, donations ?? []),
        extendedProps: {
          driver: driverId,
        },
      }));
      setAllDrivers(driversFromDB);

      calendarRef.current.getApi().removeAllEventSources();
      calendarRef.current.getApi().addEventSource(eventsList);
    };
    fetchAllRoutesAndDrivers();
  }, []);

  const handleDateSelect = e => {
    if (role !== DRIVER_ROLE) {
      setSelectedCalendarDate(e);
      createRouteOnOpen();
    }
  };

  /* eslint no-underscore-dangle: 0 */
  const handleEventClick = e => {
    const { publicId, extendedProps } = e.event._def;
    const routeDriver = extendedProps.driverId ?? null;
    setSelectedRouteId(publicId);
    const eventDate = new Date(e.event._instance.range.start);
    eventDate.setHours(0, 0, 0, 0);
    const filteredDrivers = allDrivers.filter(
      ({ id, assignedRoutes }) =>
        id === routeDriver || !assignedRoutes.includes(eventDate.toISOString().split('T')[0]),
    );
    setDrivers(filteredDrivers);
    setSelectedEventDate(eventDate);
    editRouteOnOpen();
    // setOverflow('hidden');
  };

  const handleEditRouteOnClose = () => {
    setSelectedRouteId('');
    editRouteOnClose();
    // setOverflow('visible');
  };

  const handleCalendarAddEvent = (eventId, eventName, startDate) => {
    const calendar = calendarRef.current.getApi();
    calendar.unselect();
    calendar.addEvent({
      id: eventId,
      title: eventName,
      start: startDate, // "2023-02-15"
      allDay: true,
    });
  };
  const breakpointsW = {
    sm: '100%',
    md: '100%',
    lg: '70%',
    xl: '60%', // 80em+
  };

  return (
    <Flex p={5} w={breakpointsW} h="100%">
      <EditRouteModal
        routeId={selectedRouteId}
        routeDate={selectedEventDate}
        drivers={drivers}
        isOpen={editRouteIsOpen}
        onClose={handleEditRouteOnClose}
        role={role}
      />
      <CreateRouteModal
        routeDate={selectedCalendarDate.start}
        drivers={drivers}
        isOpen={createRouteIsOpen}
        onClose={createRouteOnClose}
        handleCalendarAddEvent={handleCalendarAddEvent}
      />
      <Box>
        {role !== DRIVER_ROLE && (
          <Flex gap="1em" align="center">
            <Heading as="h3" size="lg" noOfLines={1}>
              Routes Calendar
            </Heading>
            <Button
              leftIcon={<AddIcon boxSize={3} />}
              onClick={createRouteOnOpen}
              colorScheme="blue"
              marginBottom={1}
              size="xs"
            >
              Create Route
            </Button>
          </Flex>
        )}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          initialView="dayGridMonth"
          fixedWeekCount={false}
          selectable
          dayMaxEvents
          select={handleDateSelect}
          eventClick={handleEventClick}
          contentHeight="auto"
          height="100%" // was 1vh
        />
      </Box>
    </Flex>
  );
};

export default RouteCalendar;

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
import { getAllRoutes, getDrivers, dateHasPassed } from '../../utils/RouteUtils';

// Override the CSS rules for .fc-today
import './RouteCalendar.css';

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
  // const [drivers, setDrivers] = useState([]);
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
    if (dateHasPassed(date)) {
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
          driverId,
          date,
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
    const { date } = extendedProps;
    setSelectedRouteId(publicId);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    setSelectedEventDate(eventDate);
    editRouteOnOpen();
  };

  const handleEditRouteOnClose = () => {
    setSelectedRouteId('');
    editRouteOnClose();
  };

  const handleCalendarAddEvent = (eventId, eventName, startDate, driverId) => {
    const calendar = calendarRef.current.getApi();
    calendar.unselect();
    calendar.addEvent({
      id: eventId,
      title: eventName,
      start: startDate, // "2023-02-15"
      allDay: true,
      ...grayRoute,
      extendedProps: {
        driverId,
        startDate,
      },
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
        allDrivers={allDrivers}
        setAllDrivers={setAllDrivers}
        isOpen={editRouteIsOpen}
        onClose={handleEditRouteOnClose}
        role={role}
      />
      <CreateRouteModal
        routeDate={selectedCalendarDate.start ?? new Date()}
        allDrivers={allDrivers}
        setAllDrivers={setAllDrivers}
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
              display="inline-block"
              leftIcon={<AddIcon boxSize={3} />}
              onClick={createRouteOnOpen}
              colorScheme="blue"
              marginBottom={0}
              size="sm"
            >
              Create Route
            </Button>
          </Flex>
        )}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev next today',
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
          height="auto" // was 1vh
          buttonText={{
            today: 'Today',
          }}
        />
      </Box>
    </Flex>
  );
};

export default RouteCalendar;

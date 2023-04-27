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
import { AUTH_ROLES } from '../../utils/config';
import { getAllRoutes, getDrivers } from '../../utils/RouteUtils';

const { DRIVER_ROLE } = AUTH_ROLES;

const RouteCalendar = () => {
  const [role, setRole] = useState([]);
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

  useEffect(() => {
    const fetchAllRoutesAndDrivers = async () => {
      const currentUserId = getCurrentUserId();
      const currentUser = await getUserFromDB(currentUserId);
      const { role: userRole } = currentUser;
      setRole(userRole);
      // TODO: add color indication for driver logged in
      const [routesFromDB, driversFromDB] = await Promise.all([getAllRoutes(), getDrivers()]);
      const eventsList = routesFromDB.map(({ id, name, date, driverId }) =>
        driverId !== currentUserId
          ? {
              id,
              title: name,
              start: new Date(date).toISOString().replace(/T.*$/, ''),
              allDay: true,
              borderColor: '#718096',
              textColor: '#718096',
              backgroundColor: 'white',
            }
          : {
              id,
              title: name,
              start: new Date(date).toISOString().replace(/T.*$/, ''),
              allDay: true,
              backgroundColor:
                new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
                  ? '#2B6CB0'
                  : 'rgba(0, 0, 0, 0.36)',
            },
      );
      setDrivers(driversFromDB);

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
    setSelectedRouteId(e.event._def.publicId);
    setSelectedEventDate(e.event._instance.range.start);
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
    md: '80%',
    lg: '70%',
    xl: '60%', // 80em+
  };

  const breakpointsMb = {
    base: '5rem',
    md: '8rem',
  };
  const breakpointsMt = {
    base: '3rem',
  };

  return (
    <Flex p={5} mb={breakpointsMb} w={breakpointsW} mt={breakpointsMt}>
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
          <Flex gap="1em" align="end">
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
          height="1vh"
        />
      </Box>
    </Flex>
  );
};

export default RouteCalendar;

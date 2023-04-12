/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Flex, useDisclosure, Button } from '@chakra-ui/react';
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
      const currentUserId = await getCurrentUserId();
      const currentUser = await getUserFromDB(currentUserId);
      const { role: userRole } = currentUser;
      setRole(userRole);
      // TODO: add color indication for driver logged in
      const [routesFromDB, driversFromDB] = await Promise.all([getAllRoutes(), getDrivers()]);
      const eventsList = routesFromDB.map(({ id, name, date, driverId, firstName }) =>
        driverId !== currentUserId
          ? {
              id,
              title: `${firstName}'s Route`,
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
              backgroundColor: new Date(date) > new Date() ? '#2B6CB0' : 'rgba(0, 0, 0, 0.36)',
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
  };

  const handleEditRouteOnClose = () => {
    setSelectedRouteId('');
    editRouteOnClose();
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

  return (
    <Flex p={5} height="90vh">
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
      <Box
        flex="1"
        _hover={{
          backgroundColor: 'white',
        }}
      >
        {role !== DRIVER_ROLE && (
          <Button
            leftIcon={<AddIcon boxSize={3} />}
            onClick={createRouteOnOpen}
            colorScheme="blue"
            marginBottom={1}
          >
            Create Route
          </Button>
        )}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          initialView="dayGridMonth"
          fixedWeekCount={false}
          selectable
          dayMaxEvents
          select={handleDateSelect}
          eventClick={handleEventClick}
        />
      </Box>
    </Flex>
  );
};

export default RouteCalendar;

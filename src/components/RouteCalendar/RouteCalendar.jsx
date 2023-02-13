/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Heading,
  Text,
  Box,
  UnorderedList,
  ListItem,
  Flex,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CreateRouteModal from '../CreateRouteModal/CreateRouteModal';
import { getAllRoutes } from '../../utils/RouteUtils';
import EditRouteModal from '../EditRouteModal/EditRouteModal';

const RouteCalendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
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
    const fetchAllRoutes = async () => {
      const routesFromDB = await getAllRoutes();
      const eventsList = routesFromDB.map(route => ({
        id: route.id,
        title: route.name,
        start: new Date(route.date).toISOString().replace(/T.*$/, ''),
        allDay: true,
      }));
      calendarRef.current.getApi().addEventSource(eventsList);
    };
    fetchAllRoutes();
  }, []);

  const handleDateSelect = e => {
    setSelectedCalendarDate(e);
    createRouteOnOpen();
  };

  /* eslint no-underscore-dangle: 0 */
  const handleEventClick = e => {
    setSelectedRouteId(e.event._def.publicId);
    setSelectedEventDate(e.event._instance.range.end);
    editRouteOnOpen();
  };

  const handleEditRouteOnClose = () => {
    setSelectedRouteId('');
    editRouteOnClose();
  };

  const handleCalendarAddEvent = (eventId, eventName) => {
    const {
      view: { calendar },
      startStr,
      allDay,
    } = selectedCalendarDate;

    calendar.unselect();

    calendar.addEvent({
      id: eventId,
      title: eventName,
      start: startStr,
      allDay,
    });
  };

  const renderSidebar = (
    <Box w="300px">
      <Box>
        <Heading size="md">All Routes ({currentEvents.length})</Heading>
        <UnorderedList>
          {currentEvents.map(event => (
            <ListItem key={event.id}>
              <Text as="b" mr="1">
                {formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}
              </Text>
              <Text as="i">{event.title}</Text>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </Box>
  );

  return (
    <Flex p={5} height="90vh">
      <EditRouteModal
        routeId={selectedRouteId}
        routeDate={selectedEventDate}
        isOpen={editRouteIsOpen}
        onClose={handleEditRouteOnClose}
      />
      <CreateRouteModal
        routeDate={selectedCalendarDate.start}
        isOpen={createRouteIsOpen}
        onClose={createRouteOnClose}
        handleCalendarAddEvent={handleCalendarAddEvent}
      />
      {renderSidebar}
      <Box
        flex="1"
        _hover={{
          backgroundColor: 'white',
        }}
      >
        <Button
          leftIcon={<AddIcon boxSize={3} />}
          onClick={createRouteOnOpen}
          colorScheme="blue"
          marginBottom={1}
        >
          Create Route
        </Button>
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
          eventsSet={events => {
            setCurrentEvents(events);
          }}
        />
      </Box>
    </Flex>
  );
};

export default RouteCalendar;

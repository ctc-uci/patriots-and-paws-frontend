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

const RouteCalendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchAllRoutes = async () => {
      const routesFromDB = await getAllRoutes();
      const eventsList = routesFromDB.map(route => ({
        id: route.id,
        title: route.name,
        start: new Date(route.date).toISOString().replace(/T.*$/, ''),
        allDay: true,
      }));
      setCurrentEvents(eventsList);
      calendarRef.current.getApi().addEventSource(eventsList);
    };
    fetchAllRoutes();
  }, []);

  const handleDateSelect = e => {
    setSelectedDate(e);
    onOpen();
  };

  const handleCalendarAddEvent = (eventId, eventName) => {
    const {
      view: { calendar },
      startStr,
      allDay,
    } = selectedDate;

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
      <CreateRouteModal
        routeDate={selectedDate.start}
        isOpen={isOpen}
        onClose={onClose}
        handleCalendarAddEvent={handleCalendarAddEvent}
      />
      {renderSidebar}
      <Box
        flex="1"
        _hover={{
          backgroundColor: 'white',
        }}
      >
        <Button leftIcon={<AddIcon />} onClick={onOpen} colorScheme="blue">
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
          eventClick={({ event }) => event.remove()}
          eventsSet={events => {
            setCurrentEvents(events);
          }}
        />
      </Box>
    </Flex>
  );
};

export default RouteCalendar;

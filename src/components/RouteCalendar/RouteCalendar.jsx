/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Heading,
  Text,
  Switch,
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
// import styles from './RouteCalendar.module.css';

const todayStr = new Date().toISOString().replace(/T.*$/, '');

const INITIAL_EVENTS = [
  {
    id: 0,
    title: 'All-day event',
    start: todayStr,
  },
  {
    id: 1,
    title: 'Timed event',
    start: `${todayStr}T12:00:00`,
    end: `${todayStr}T14:00:00`,
  },
];

const RouteCalendar = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const eventInfo = currentEvents.map(({ _def: { title }, _instance: { range } }) => ({
      title,
      range,
    }));
    eventInfo.forEach(e => e); // placeholder so linting doesn't get mad at me
  }, [currentEvents]);

  const handleDateSelect = e => {
    setSelectedDate(e.start);
    onOpen();
  };

  const renderSidebar = (
    <Box w="300px">
      <Box>
        <Heading>Instructions</Heading>
        <UnorderedList>
          <ListItem>Select date and you will be prompted to create a new event</ListItem>
          <ListItem>Click an event to delete it</ListItem>
        </UnorderedList>
      </Box>
      <Switch my="3" isChecked={weekendsVisible} onChange={() => setWeekendsVisible(prev => !prev)}>
        toggle weekends
      </Switch>
      <Box>
        <Heading size="md">All Events ({currentEvents.length})</Heading>
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
    <Flex p="1">
      <CreateRouteModal routeDate={selectedDate} isOpen={isOpen} onClose={onClose} />
      {renderSidebar}
      <Box flex="1">
        <Button leftIcon={<AddIcon />} onClick={onOpen} colorScheme="blue">
          Create Route
        </Button>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek', // ,timeGridDay
          }}
          initialView="dayGridMonth"
          //   editable
          selectable
          selectMirror
          dayMaxEvents
          weekends={weekendsVisible}
          initialEvents={INITIAL_EVENTS}
          select={handleDateSelect} // could change to dateClick
          eventContent={eventInfo => (
            <>
              {eventInfo.timeText && (
                <Text as="b" mr="1">
                  {eventInfo.timeText}
                </Text>
              )}
              <Text as="i">{eventInfo.event.title}</Text>
            </>
          )}
          eventClick={({ event }) => event.remove()}
          eventsSet={events => setCurrentEvents(events)} // called after events are initialized/added/changed/removed
          // eventAdd={event => console.log(event)}
          // eventChange={event => console.log(event)}
          // eventRemove={event => console.log(event)}
        />
      </Box>
    </Flex>
  );
};

export default RouteCalendar;

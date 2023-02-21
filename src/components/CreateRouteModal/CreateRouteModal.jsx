/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { calendarConfigs } from '../../utils/utils';
import { createRoute } from '../../utils/RouteUtils';

const CreateRouteModal = ({ routeDate, drivers, isOpen, onClose, handleCalendarAddEvent }) => {
  const [date, setDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState();

  const formSchema = yup.object({
    routeName: yup.string().required('Please enter a name for the route'),
    assignedDriver: yup.string().nullable(),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  useEffect(() => {
    if (routeDate) {
      setDate(routeDate);
    }
  }, [routeDate]);

  const clearState = () => {
    reset({
      assignedDriver: null,
      routeName: '',
    });

    setDate(new Date());
    setErrorMessage('');
  };

  const onSubmit = async e => {
    try {
      const { assignedDriver, routeName } = e;
      // set time to 12 AM PST to make Create Route button Date consistent with date selection from calendar
      date.setHours(0, 0, 0, 0);
      const dateString = date.toISOString().substring(0, 10);

      const route = {
        driverId: assignedDriver,
        name: routeName,
        date: dateString,
      };

      const res = await createRoute(route);
      const { id, name } = res;
      handleCalendarAddEvent(id, name, date);
      clearState();
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleCancel = () => {
    clearState();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} scrollBehavior="outside">
      <ModalOverlay />
      <ModalContent p={5}>
        <ModalHeader>
          <Heading>Create Route</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <FormControl isRequired>
              <FormLabel paddingTop={3}>Route Name</FormLabel>
              <Input
                id="route-name"
                placeholder="Name"
                marginBottom={3}
                {...register('routeName')}
                isRequired
              />
            </FormControl>
            <Box>{errors.routeName?.message}</Box>
            <FormControl>
              <FormLabel paddingTop={3}>Assigned Driver</FormLabel>
              <Select placeholder="Select Driver" {...register('assignedDriver')} marginBottom={3}>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.firstName} {driver.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Box>{errors.assignedDriver?.message}</Box>
            <FormControl isRequired>
              <FormLabel paddingTop={3}>Date</FormLabel>
              <SingleDatepicker
                name="date-input"
                date={date}
                onDateChange={setDate}
                configs={calendarConfigs}
                marginBottom={3}
              />
            </FormControl>
          </form>
          <Box>{errorMessage}</Box>
        </ModalBody>

        <ModalFooter>
          <HStack justifyContent="center" alignItems="center" width="100%" spacing={5}>
            <Button colorScheme="gray" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" onClick={handleSubmit(onSubmit)}>
              Add
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

CreateRouteModal.propTypes = {
  routeDate: PropTypes.object,
  drivers: PropTypes.array,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  handleCalendarAddEvent: PropTypes.func,
}.isRequired;

export default CreateRouteModal;
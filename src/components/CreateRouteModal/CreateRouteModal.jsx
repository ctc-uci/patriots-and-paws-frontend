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

const CreateRouteModal = ({
  routeDate,
  allDrivers,
  isOpen,
  onClose,
  handleCalendarAddEvent,
  refreshRoutes,
}) => {
  const [date, setDate] = useState(new Date());
  const [drivers, setDrivers] = useState(allDrivers ?? []);
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

  useEffect(() => {
    reset({
      assignedDriver: null,
    });
    const filteredDrivers = allDrivers?.filter(
      ({ assignedRoutes }) => !assignedRoutes.includes(date.toISOString().split('T')[0]),
    );
    setDrivers(filteredDrivers);
  }, [date]);

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
      const submitDate = new Date(date);
      submitDate.setHours(0, 0, 0, 0);
      const dateString = submitDate.toISOString().substring(0, 10);

      const route = {
        driverId: assignedDriver,
        name: routeName,
        date: dateString,
      };
      if (assignedDriver) {
        const { assignedRoutes } = allDrivers.find(d => d.id === assignedDriver);
        assignedRoutes.push(dateString);
      }
      const res = await createRoute(route);
      const { id, name } = res;
      handleCalendarAddEvent(id, name, submitDate, assignedDriver);
      clearState();
      refreshRoutes();
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
    <Modal isOpen={isOpen} onClose={handleCancel} scrollBehavior="outside" isCentered>
      <ModalOverlay />
      <ModalContent p={5}>
        <ModalHeader>
          <Heading>Create Route</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <FormControl isRequired my="1em">
              <FormLabel>Route Name</FormLabel>
              <Input
                id="route-name"
                placeholder="Name"
                {...register('routeName')}
                maxLength="28"
                textOverflow="ellipsis"
                isRequired
              />
            </FormControl>
            <Box>{errors.routeName?.message}</Box>
            <FormControl isRequired my="1em">
              <FormLabel>Date</FormLabel>
              <SingleDatepicker
                name="date-input"
                date={date}
                onDateChange={setDate}
                configs={calendarConfigs}
                minDate={new Date().setDate(new Date().getDate() - 1)}
              />
            </FormControl>
            <FormControl my="1em">
              <FormLabel>Assigned Driver</FormLabel>
              <Select placeholder="Select Driver" {...register('assignedDriver')}>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.firstName} {driver.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Box>{errors.assignedDriver?.message}</Box>
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
  allDrivers: PropTypes.array,
  setAllDrivers: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  handleCalendarAddEvent: PropTypes.func,
  refreshRoutes: PropTypes.func,
}.isRequired;

export default CreateRouteModal;

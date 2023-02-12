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
import { createRoute, getDrivers } from '../../utils/RouteUtils';
import styles from './CreateRouteModal.module.css';

const CreateRouteModal = ({ routeDate, isOpen, onClose, handleCalendarAddEvent }) => {
  const [date, setDate] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversFromDB = await getDrivers();
      setDrivers(driversFromDB);
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    setDate(routeDate);
  }, [routeDate]);

  const formSchema = yup.object({
    routeName: yup.string().required('Please enter a name for the route'),
    assignedDriver: yup.string().required('Please select a driver for this route'),
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

  const onSubmit = async e => {
    try {
      const { assignedDriver, routeName } = e;
      const dateString = date.toISOString().substr(0, 10);

      const route = {
        driverId: assignedDriver,
        name: routeName,
        date: dateString,
      };

      const res = await createRoute(route);
      handleCalendarAddEvent(res.id, res.name);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleCancel = () => {
    reset({
      assignedDriver: null,
      routeName: '',
    });

    setDate(new Date());
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        <ModalContent className={styles['route-modal-container']}>
          <ModalHeader>
            <Heading>Create Route</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl isRequired>
                <FormLabel className={styles['route-modal-form-label']}>Route Name</FormLabel>
                <Input
                  id="route-name"
                  placeholder="Name"
                  className={styles['route-modal-input']}
                  {...register('routeName')}
                  isRequired
                />
                <Box className={styles['error-box']}>{errors.routeName?.message}</Box>
                <FormLabel className={styles['route-modal-form-label']}>Assigned Driver</FormLabel>
                <Select
                  placeholder="Select Driver"
                  {...register('assignedDriver')}
                  className={styles['route-modal-input']}
                >
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </Select>
                <Box className={styles['error-box']}>{errors.assignedDriver?.message}</Box>
                <FormLabel className={styles['route-modal-form-label']}>Date</FormLabel>
              </FormControl>
              <SingleDatepicker
                name="date-input"
                date={date}
                onDateChange={setDate}
                configs={calendarConfigs}
                className={styles['route-modal-input']}
              />
            </form>
            <Box className={styles['error-box']}>{errorMessage}</Box>
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
    </>
  );
};

CreateRouteModal.propTypes = {
  routeDate: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  handleCalendarAddEvent: PropTypes.func,
}.isRequired;

export default CreateRouteModal;

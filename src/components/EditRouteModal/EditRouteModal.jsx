import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Flex,
  Icon,
  List,
  ListItem,
  Box,
  Text,
  HStack,
  Button,
  Stack,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  Heading,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Reorder } from 'framer-motion';
import { updateDonation, getRoute, updateRoute } from '../../utils/RouteUtils';
import { handleNavigateToAddress } from '../../utils/utils';

const EditRouteModal = ({ routeId, routeDate, drivers, isOpen, onClose }) => {
  const [assignedDriverId, setAssignedDriverId] = useState('');
  const [route, setRoute] = useState({});
  const [donations, setDonations] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  const fetchDonations = async () => {
    const routeFromDB = await getRoute(routeId);
    setRoute(routeFromDB);
    setAssignedDriverId(routeFromDB.driverId);
    setDonations(routeFromDB.donations ?? []);
  };

  useEffect(() => {
    if (routeId) {
      fetchDonations();
    }
  }, [routeId]);

  // create red circle icon
  const CircleIcon = props => (
    <Icon viewBox="0 0 200 200" {...props}>
      <path fill="currentColor" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" />
    </Icon>
  );

  // convert date to 'Weekday, Month Day' format
  const convertDate = date => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    return formattedDate;
  };

  const handleDriverChange = e => {
    setAssignedDriverId(e.target.value);
  };

  const clearState = () => {
    setAssignedDriverId('');
    setDonations([]);
    setErrorMessage('');
  };

  const handleSave = async () => {
    try {
      const updatedRoute = Object.assign(route, { driverId: assignedDriverId });
      await updateRoute(updatedRoute);

      const updatedDonations = donations.map((donation, index) =>
        Object.assign(donation, { orderNum: index + 1 }),
      );

      // update donations in parallel
      const updateDonationPromises = updatedDonations.map(donation => updateDonation(donation));
      await Promise.all(updateDonationPromises);

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
    <Modal size="xl" isOpen={isOpen} onClose={handleCancel} scrollBehavior="outside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack>
            <Heading paddingLeft={5} paddingTop={5}>
              Route #{routeId}
            </Heading>
            <Flex justifyContent="space-between">
              <Text paddingLeft={5} fontSize="md" fontWeight="normal">
                {convertDate(routeDate)}
              </Text>
              <Button
                size="xs"
                rightIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigateToAddress(donations)}
                marginRight={5}
              >
                Navigate to Address
              </Button>
            </Flex>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack p={5}>
            {donations.length === 0 && <Text fontWeight="bold">No pickups scheduled.</Text>}
            <List
              style={{ borderLeft: '1px solid black' }}
              as={Reorder.Group}
              spacing={2}
              axis="y"
              values={donations}
              onReorder={setDonations}
            >
              {donations.map(donation => (
                <ListItem
                  margin="0"
                  padding="0"
                  as={Reorder.Item}
                  key={donation.orderNum}
                  value={donation}
                  dragTransition={{
                    bounceStiffness: 600,
                  }}
                  initial="notDragging"
                  whileDrag="dragging"
                  position="relative"
                  cursor="move"
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <CircleIcon margin={-2} boxSize={4} color="#fc8181" />
                    <Box
                      marginLeft={5}
                      backgroundColor="white"
                      border="solid"
                      borderWidth={1}
                      borderColor="black"
                      p={5}
                      fontSize={16}
                      width="500px"
                    >
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text>Donation #{donation.id}</Text>
                        <Text>
                          {donation.firstName} {donation.lastName}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </ListItem>
              ))}
            </List>
            <FormControl isRequired>
              <FormLabel paddingTop={6}>Assigned Driver</FormLabel>
              <Select
                value={assignedDriverId}
                placeholder="Select Driver"
                onChange={handleDriverChange}
              >
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.firstName} {driver.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Box>{errorMessage}</Box>
        </ModalBody>
        <ModalFooter>
          <HStack
            justifyContent="center"
            alignItems="center"
            width="100%"
            spacing={5}
            paddingBottom={5}
          >
            <Button colorScheme="gray" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" onClick={handleSave}>
              Save changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

EditRouteModal.propTypes = {
  routeId: PropTypes.string,
  routeDate: PropTypes.instanceOf(Date),
  drivers: PropTypes.instanceOf(Array).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

EditRouteModal.defaultProps = {
  routeId: '',
  routeDate: new Date(),
};

export default EditRouteModal;

import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Flex,
  Icon,
  List,
  ListItem,
  Box,
  Card,
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
  Switch,
} from '@chakra-ui/react';
import { ArrowForwardIcon, DragHandleIcon, QuestionIcon } from '@chakra-ui/icons';
import { Reorder } from 'framer-motion';
import { updateDonation, getRoute, updateRoute } from '../../utils/RouteUtils';
import { handleNavigateToAddress } from '../../utils/utils';
import { AUTH_ROLES } from '../../utils/config';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES;

const EditRouteModal = ({ routeId, routeDate, drivers, isOpen, onClose, role }) => {
  const [assignedDriverId, setAssignedDriverId] = useState('');
  const [route, setRoute] = useState({});
  const [donations, setDonations] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [modalState, setModalState] = useState('view');

  const fetchDonations = async () => {
    const routeFromDB = await getRoute(routeId);
    console.log(routeFromDB.donations);
    setRoute(routeFromDB);
    setAssignedDriverId(routeFromDB.driverId);
    setDonations(routeFromDB.donations);
  };

  useEffect(() => {
    if (routeId) {
      fetchDonations();
    }
  }, [routeId]);

  useEffect(() => {
    console.log(modalState);
  }, [modalState]);

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
    setModalState('view');
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
    setModalState('view');
    clearState();
    onClose();
  };

  const handleChangeToEdit = () => {
    setModalState('edit');
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
              </Button>{' '}
            </Flex>
            <Flex direction="row" gap={5} paddingTop={2} PaddingRight={5} justify="space-between">
              {(role === ADMIN_ROLE || role === SUPERADMIN_ROLE) && (
                <FormControl isRequired>
                  <Select
                    isDisabled={modalState == 'view'}
                    variant="outline"
                    size="sm"
                    width="80%"
                    paddingLeft={5}
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
              )}
              <FormControl display="flex" PaddingRight={5}>
                <Text fontSize="sm" fontWeight="normal" mb="0" mr={3}>
                  Show confirmed donations only
                </Text>
                <Switch PaddingRight={7} id="confirmed-donations" />
              </FormControl>
            </Flex>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack pl={5} pr={5}>
            {donations.length === 0 && <Text fontWeight="bold">No pickups scheduled.</Text>}
            {modalState === 'edit' && (
              <List
                as={Reorder.Group}
                spacing={2}
                axis="y"
                values={donations}
                styleType="decimal"
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
                      <Card
                        marginLeft={5}
                        backgroundColor="white"
                        border="solid"
                        borderWidth={1}
                        borderColor="#E2E8F0"
                        p={5}
                        fontSize={16}
                        width="500px"
                      >
                        <HStack spacing="1rem">
                          <DragHandleIcon />
                          <Stack spacing="0.1rem">
                            <Text fontWeight="bold">Donation #{donation.id}</Text>
                            <Text>
                              {donation.firstName} {donation.lastName} | Items:{' '}
                              {donation.furniture.length ? donation.furniture.length : 0}
                            </Text>
                          </Stack>
                        </HStack>
                      </Card>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            )}
            {modalState === 'view' && (
              <List spacing={2} axis="y" values={donations}>
                {donations.map(donation => (
                  <ListItem margin="0" padding="0" key={donation.orderNum} value={donation.items}>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Card
                        PaddingLeft={5}
                        backgroundColor="white"
                        border="solid"
                        borderWidth={1}
                        borderColor="#E2E8F0"
                        p={5}
                        fontSize={16}
                        width="500px"
                      >
                        <Flex justifyContent="space-between" alignItems="center">
                          <Stack spacing="0.1rem">
                            <Text fontWeight="bold">Donation #{donation.id}</Text>
                            <Text>
                              {donation.firstName} {donation.lastName} | Items:{' '}
                              {donation.furniture.length ? donation.furniture.length : 0}
                            </Text>
                          </Stack>
                        </Flex>
                      </Card>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
          <Box>{errorMessage}</Box>
        </ModalBody>
        <ModalFooter>
          <Flex
            direction="row"
            justify="space-between"
            alignItems="center"
            width="100%"
            spacing={5}
            paddingBottom={5}
            paddingLeft={5}
            paddingRight={5}
          >
            {modalState === 'edit' && (
              <>
                <QuestionIcon h={5} w={5} color="#718096" />
                <Flex justify="left" gap={2}>
                  <Button colorScheme="gray" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" type="submit" onClick={handleSave}>
                    Save changes
                  </Button>
                </Flex>
              </>
            )}
            {modalState === 'view' && (
              <>
                <Flex justify="left" gap={2}>
                  <Button
                    colorScheme="blackAlpha"
                    type="submit"
                    onClick={() => {
                      console.log('unimplemented');
                    }}
                  >
                    Export PDF
                  </Button>
                  <Button
                    colorScheme="teal"
                    type="submit"
                    onClick={() => {
                      console.log('unimplemented');
                    }}
                  >
                    Navigate to Route
                  </Button>
                </Flex>
                {(role === ADMIN_ROLE || role === SUPERADMIN_ROLE) && (
                  <Button
                    colorScheme="blue"
                    type="submit"
                    justify="right"
                    onClick={handleChangeToEdit}
                  >
                    Reorder Routes
                  </Button>
                )}
              </>
            )}
          </Flex>
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

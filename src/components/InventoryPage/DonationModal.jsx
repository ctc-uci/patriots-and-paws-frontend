import React, { useState, useEffect } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Flex,
  Text,
  Input,
  Stack,
  InputLeftAddon,
  InputGroup,
  Textarea,
  Modal,
  Tag,
  useDisclosure,
  Select,
  useToast,
} from '@chakra-ui/react';

import { PropTypes } from 'prop-types';
import { PNPBackend, handleNavigateToAddress } from '../../utils/utils';
import { makeDate, displayStatuses, statusColorMap, EMAIL_TYPE } from '../../utils/InventoryUtils';
import DonationImagesContainer from './DonationImagesContainer';
import DonationFurnitureContainer from './DonationFurnitureContainer';
import EmailModal from './EmailModal';
import { STATUSES } from '../../utils/config';
import AlertBanner from './AlertBanner';

const {
  RESCHEDULE,
  PENDING,
  CHANGES_REQUESTED,
  SCHEDULED,
  SCHEDULING,
  PICKED_UP,
  APPROVAL_REQUESTED,
} = STATUSES;
const { CANCEL_PICKUP, APPROVE, REQUEST_CHANGES, DELETE_DONATION } = EMAIL_TYPE;

const DonationModal = ({ data, onClose, isOpen, setAllDonations, routes }) => {
  const {
    id,
    status,
    firstName,
    lastName,
    submittedDate,
    addressStreet,
    addressUnit,
    addressCity,
    addressZip,
    email,
    phoneNum,
    notes,
    pictures,
    furniture,
    pickupDate,
    routeId,
  } = data;

  const [emailStatus, setEmailStatus] = useState('');
  const [currentStatus, setCurrentStatus] = useState(status);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledRouteId, setScheduledRouteId] = useState('');

  const {
    isOpen: emailModalIsOpen,
    onOpen: emailModalOnOpen,
    onClose: emailModalOnClose,
  } = useDisclosure();

  const toast = useToast();

  const updateDonation = async ({ newStatus, newPickupDate, newRouteId }) => {
    setAllDonations(prev =>
      prev.map(ele =>
        ele.id === id
          ? { ...ele, status: newStatus, pickupDate: newPickupDate, routeId: newRouteId }
          : ele,
      ),
    );
    await PNPBackend.put(`/donations/${id}`, {
      status: newStatus,
    });
  };

  const makeStatusTag = curStatus => {
    return (
      <Tag
        visibility={curStatus === RESCHEDULE && 'hidden'}
        size="sm"
        mt="1%"
        ml="1%"
        variant="solid"
        colorScheme={statusColorMap[curStatus]}
      >
        {displayStatuses[curStatus]}
      </Tag>
    );
  };

  const resetScheduledRoute = donationStatus => {
    if (donationStatus !== RESCHEDULE) {
      setScheduledDate(pickupDate?.replace(/T.*$/, '') ?? '');
      setScheduledRouteId(routeId ?? '');
    } else {
      setScheduledDate('');
      setScheduledRouteId('');
    }
  };

  const removeSelectedRouteOption = allRoutes => {
    return Object.fromEntries(
      Object.entries(allRoutes).filter(route => route[0] !== pickupDate?.replace(/T.*$/, '') ?? ''),
    );
  };

  const displayedRouteOptions = status === RESCHEDULE ? removeSelectedRouteOption(routes) : routes;

  useEffect(() => {
    setCurrentStatus(status);
    resetScheduledRoute(status);
  }, [data]);

  const onDeleteDonation = async () => {
    await PNPBackend.delete(`/donations/${id}`);
    setAllDonations(prev => prev.filter(donation => donation.id !== id));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetScheduledRoute(currentStatus);
        onClose();
      }}
      size="6xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mr="1%" ml="1%">
          {currentStatus && makeStatusTag(currentStatus)}
          <Flex direction="row">
            <Flex direction="column">
              <Text ml="0.5em" fontSize="1.5em">
                Donation #{id}
              </Text>
              <Text ml="1em" fontSize="0.75em">
                Submission Date: {makeDate(submittedDate)}
              </Text>
            </Flex>
            {currentStatus === RESCHEDULE && <AlertBanner />}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="row" m={3}>
            <Box h="100%" w="60%" m="-1.5em 1em 1em 1em">
              {/* BASIC INFO SECTION */}
              <>
                <Text mb="1%" fontSize="1.25em" fontWeight="medium">
                  Basic Information
                </Text>
                <Stack spacing="1%">
                  <InputGroup width="50%">
                    <InputLeftAddon>Name</InputLeftAddon>
                    <Input defaultValue={`${firstName} ${lastName}`} isReadOnly />
                  </InputGroup>
                </Stack>
                <Stack direction="row" my="1%">
                  <InputGroup>
                    <InputLeftAddon>Email</InputLeftAddon>
                    <Input defaultValue={email} isReadOnly />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>Phone Number</InputLeftAddon>
                    <Input type="tel" defaultValue={phoneNum} isReadOnly />
                  </InputGroup>
                </Stack>
              </>
              {/* ADDRESS SECTION */}
              <>
                <Stack direction="row" mt="3%" mb="0.75%">
                  <Text mb="1%" fontSize="1.25em" fontWeight="medium">
                    Address
                  </Text>
                  <Box>
                    <Button
                      ml="15%"
                      colorScheme="teal"
                      size="sm"
                      type="submit"
                      onClick={() => {
                        handleNavigateToAddress([data]);
                      }}
                    >
                      Navigate
                    </Button>
                  </Box>
                </Stack>
                <Stack spacing="1%" direction="row">
                  <Stack spacing="1%" direction="column">
                    <InputGroup>
                      <InputLeftAddon>Street Address</InputLeftAddon>
                      <Input defaultValue={addressStreet} isReadOnly />
                    </InputGroup>
                    <Stack spacing="1%" direction="row">
                      <InputGroup>
                        <InputLeftAddon>City</InputLeftAddon>
                        <Input defaultValue={addressCity} isReadOnly />
                      </InputGroup>
                      <InputGroup>
                        <InputLeftAddon>State</InputLeftAddon>
                        <Input defaultValue="CA" isReadOnly />
                      </InputGroup>
                    </Stack>
                  </Stack>
                  <Stack spacing="1%" direction="column">
                    <InputGroup>
                      <InputLeftAddon>Unit</InputLeftAddon>
                      <Input defaultValue={addressUnit} isReadOnly />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftAddon>Zip Code</InputLeftAddon>
                      <Input defaultValue={addressZip} isReadOnly />
                    </InputGroup>
                  </Stack>
                </Stack>
              </>
              {/* SPECIAL INSTRUCTIONS SECTION */}
              <>
                <Text mt="2.5%" mb="0.75%" fontSize="1.25em" fontWeight="medium">
                  Special Instructions
                </Text>
                <Textarea defaultValue={notes} isReadOnly />
              </>
              {/* SCHEDULE SECTION */}
              <Flex
                direction="row"
                bg="#E2E8F0"
                align="center"
                mt="1em"
                borderRadius={6}
                gap={5}
                px="3%"
                py="1%"
              >
                <Text fontSize="1.25em">Schedule</Text>
                <Select
                  placeholder={(!pickupDate || currentStatus === RESCHEDULE) && 'Choose a date'}
                  onChange={e => {
                    setScheduledDate(e.target.value);
                    setScheduledRouteId('');
                  }}
                  defaultValue={scheduledDate}
                  bg="white"
                  isDisabled={
                    ![PENDING, RESCHEDULE, CHANGES_REQUESTED, APPROVAL_REQUESTED].includes(
                      currentStatus,
                    )
                  }
                >
                  {Object.keys(displayedRouteOptions).map(day => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </Select>
                <Select
                  placeholder={(!routeId || currentStatus === RESCHEDULE) && 'Choose a route'}
                  isDisabled={
                    ![PENDING, RESCHEDULE, CHANGES_REQUESTED, APPROVAL_REQUESTED].includes(
                      currentStatus,
                    ) || !scheduledDate
                  }
                  onChange={e => setScheduledRouteId(e.target.value)}
                  bg="white"
                >
                  {scheduledDate &&
                    displayedRouteOptions[scheduledDate]?.map(({ id: optionId, name }) => (
                      <option key={optionId} value={optionId}>
                        {name}
                      </option>
                    ))}
                </Select>
              </Flex>
            </Box>

            <Box h="50%" w="40%" xl="1%">
              <Box>
                <Text mb="1%" fontSize="1.25em">
                  Images
                </Text>
                <DonationImagesContainer pictures={pictures} />
              </Box>

              <Box h="50%" w="100%">
                <Text my="1%" fontSize="1.25em">
                  Furniture Items
                </Text>
                <DonationFurnitureContainer data={furniture} />
              </Box>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="space-between" px="3em" py="1em">
          <Flex justify="left">
            {![SCHEDULED, SCHEDULING, PICKED_UP].includes(currentStatus) && (
              <Button
                colorScheme="red"
                justifyContent="left"
                onClick={() => {
                  console.log('hi');
                  setEmailStatus(DELETE_DONATION);
                  emailModalOnOpen();
                }}
              >
                Delete Donation
              </Button>
            )}
          </Flex>
          <Flex mr="1%" justify="right">
            {[PENDING, RESCHEDULE, CHANGES_REQUESTED, APPROVAL_REQUESTED].includes(
              currentStatus,
            ) && (
              <>
                <Button
                  colorScheme="blue"
                  justify="right"
                  isDisabled={currentStatus === CHANGES_REQUESTED}
                  onClick={() => {
                    setEmailStatus(REQUEST_CHANGES);
                    emailModalOnOpen();
                  }}
                >
                  Request Changes
                </Button>
                <Button
                  ml="2%"
                  colorScheme="green"
                  // eslint-disable-next-line consistent-return
                  onClick={() => {
                    if (!scheduledRouteId) {
                      return toast({
                        title: 'Could not approve #'.concat(id),
                        description:
                          'Please select a Date and Route before approving the donation.',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                      });
                    }
                    setEmailStatus(APPROVE);
                    emailModalOnOpen();
                  }}
                  isDisabled={
                    !scheduledRouteId && ![PENDING, CHANGES_REQUESTED].includes(currentStatus)
                  }
                >
                  Approve
                </Button>
              </>
            )}
            {[SCHEDULING, SCHEDULED].includes(currentStatus) && (
              <Button
                colorScheme="red"
                onClick={() => {
                  setEmailStatus(CANCEL_PICKUP);
                  emailModalOnOpen();
                }}
              >
                Cancel Pickup
              </Button>
            )}
          </Flex>
        </ModalFooter>
        {email && emailStatus && (
          <EmailModal
            isOpenEmailModal={emailModalIsOpen}
            onCloseEmailModal={emailModalOnClose}
            status={emailStatus}
            updateDonation={updateDonation}
            email={email}
            setCurrentStatus={setCurrentStatus}
            donationInfo={{ id, scheduledDate, scheduledRouteId }}
            onDeleteDonation={onDeleteDonation}
            onCloseDonationModal={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

DonationModal.propTypes = {
  setAllDonations: PropTypes.func,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  routes: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  ),
  data: PropTypes.shape({
    status: PropTypes.string,
    id: PropTypes.string,
    addressStreet: PropTypes.string,
    addressUnit: PropTypes.string,
    addressCity: PropTypes.string,
    addressZip: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNum: PropTypes.string,
    notes: PropTypes.string,
    submittedDate: PropTypes.string,
    pickupDate: PropTypes.string,
    routeId: PropTypes.number,
    pictures: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        imageURL: PropTypes.string,
        notes: PropTypes.string,
      }),
    ),
    furniture: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        count: PropTypes.number,
      }),
    ),
  }),
};

DonationModal.defaultProps = {
  data: {},
  isOpen: false,
  onClose: () => {},
  setAllDonations: () => {},
  routes: {},
};

export default DonationModal;

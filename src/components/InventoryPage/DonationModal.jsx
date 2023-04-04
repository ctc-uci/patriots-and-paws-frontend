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
} from '@chakra-ui/react';

import { PropTypes } from 'prop-types';
import { PNPBackend, handleNavigateToAddress } from '../../utils/utils';
import { makeDate, colorMap, EMAIL_TYPE } from '../../utils/InventoryUtils';
import DonationImagesContainer from './DonationImagesContainer';
import DonationFurnitureContainer from './DonationFurnitureContainer';
import EmailModal from './EmailModal';
import { STATUSES } from '../../utils/config';

const { PENDING, CHANGES_REQUESTED, SCHEDULED } = STATUSES;
const { CANCEL_PICKUP, APPROVE, REQUEST_CHANGES } = EMAIL_TYPE;

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
      <Tag size="sm" m={5} ml={15} colorScheme={colorMap[curStatus]}>
        {curStatus[0].toUpperCase() + curStatus.slice(1)}
      </Tag>
    );
  };

  const resetScheduledRoute = () => {
    setScheduledDate(pickupDate?.replace(/T.*$/, '') ?? '');
    setScheduledRouteId(routeId ?? '');
  };

  useEffect(() => {
    setCurrentStatus(status);
    resetScheduledRoute();
  }, [data]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetScheduledRoute();
        onClose();
      }}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader m={3}>
          <Flex>
            <Text fontSize={36}>Donation #{id}</Text>
            {currentStatus && makeStatusTag(currentStatus)}
          </Flex>
          <Text fontSize={16}>Submission Date: {makeDate(submittedDate)}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="row" m={3}>
            <Box h="100%" w="60%" m={5}>
              <Text mb={5} fontSize="20px">
                Basic Information
              </Text>
              <Stack spacing={3}>
                <InputGroup>
                  <InputLeftAddon>Name</InputLeftAddon>
                  <Input defaultValue={`${firstName} ${lastName}`} isReadOnly />
                </InputGroup>
              </Stack>
              <Stack direction="row" my={2}>
                <InputGroup>
                  <InputLeftAddon>Email</InputLeftAddon>
                  <Input defaultValue={email} isReadOnly />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Phone Number</InputLeftAddon>
                  <Input type="tel" defaultValue={phoneNum} isReadOnly />
                </InputGroup>
              </Stack>
              <Text mt="60px" mb={5} fontSize="20px">
                Address
              </Text>
              <Stack spacing={3} direction="row">
                <InputGroup>
                  <InputLeftAddon>Street Address</InputLeftAddon>
                  <Input defaultValue={addressStreet} isReadOnly />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Unit</InputLeftAddon>
                  <Input defaultValue={addressUnit} isReadOnly />
                </InputGroup>
              </Stack>
              <Stack spacing={3} direction="row" my={2}>
                <InputGroup>
                  <InputLeftAddon>City</InputLeftAddon>
                  <Input defaultValue={addressCity} isReadOnly />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>State</InputLeftAddon>
                  <Input defaultValue="CA" isReadOnly />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Zip Code</InputLeftAddon>
                  <Input defaultValue={addressZip} isReadOnly />
                </InputGroup>
              </Stack>
              <Text mt="60px" mb={5} fontSize="20px">
                Additional Comments
              </Text>
              <Textarea defaultValue={notes} isReadOnly />

              <Flex
                direction="row"
                bg="#E2E8F0"
                align="center"
                mt="2em"
                borderRadius={6}
                gap={5}
                px={5}
                py={3}
              >
                <Text fontSize="20px">Schedule</Text>
                <Select
                  placeholder={!pickupDate && 'Choose a date'}
                  onChange={e => {
                    setScheduledDate(e.target.value);
                    setScheduledRouteId('');
                  }}
                  defaultValue={scheduledDate}
                  bg="white"
                  isDisabled={![PENDING].includes(currentStatus)}
                >
                  {Object.keys(routes).map(day => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </Select>
                <Select
                  placeholder={!routeId && 'Choose a route'}
                  isDisabled={![PENDING].includes(currentStatus) || !scheduledDate}
                  onChange={e => setScheduledRouteId(e.target.value)}
                  bg="white"
                >
                  {scheduledDate &&
                    routes[scheduledDate]?.map(({ id: optionId, name }) => (
                      <option key={optionId} value={optionId}>
                        {name}
                      </option>
                    ))}
                </Select>
              </Flex>
            </Box>

            <Box h="50%" w="40%" m={5}>
              <Box>
                <Text mb={5} fontSize="20px">
                  Images
                </Text>
                <DonationImagesContainer data={pictures} />
              </Box>

              <Box h="50%" w="100%">
                <Text mt="45px" mb={5} fontSize="20px">
                  Furniture Items
                </Text>
                <DonationFurnitureContainer data={furniture} />
              </Box>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Box>
            {(currentStatus === PENDING || currentStatus === CHANGES_REQUESTED) && (
              <>
                <Button
                  colorScheme="red"
                  isDisabled={currentStatus === CHANGES_REQUESTED}
                  onClick={() => {
                    emailModalOnOpen();
                    setEmailStatus(REQUEST_CHANGES);
                  }}
                >
                  Request Changes
                </Button>
                <Button
                  ml={3}
                  colorScheme="green"
                  onClick={() => {
                    emailModalOnOpen();
                    setEmailStatus(APPROVE);
                  }}
                  isDisabled={!scheduledRouteId}
                >
                  Approve
                </Button>
              </>
            )}
            {currentStatus === SCHEDULED && (
              <Button
                ml={3}
                colorScheme="red"
                onClick={() => {
                  emailModalOnOpen();
                  setEmailStatus(CANCEL_PICKUP);
                }}
              >
                Cancel Pickup
              </Button>
            )}
          </Box>
          <Box>
            <Button
              ml={3}
              colorScheme="gray"
              type="submit"
              onClick={() => {
                handleNavigateToAddress([data]);
              }}
            >
              Navigate to Address
            </Button>
          </Box>
        </ModalFooter>
        <EmailModal
          isOpenEmailModal={emailModalIsOpen}
          onCloseEmailModal={emailModalOnClose}
          status={emailStatus}
          updateDonation={updateDonation}
          email={email}
          setCurrentStatus={setCurrentStatus}
          donationInfo={{ id, scheduledDate, scheduledRouteId }}
        />
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
    id: PropTypes.number,
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

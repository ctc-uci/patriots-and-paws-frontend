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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
// import { WarningIcon } from '@chakra-ui/icons';

import { PropTypes } from 'prop-types';
import { PNPBackend, handleNavigateToAddress } from '../../utils/utils';
import { makeDate, colorMap, EMAIL_TYPE } from '../../utils/InventoryUtils';
import DonationImagesContainer from './DonationImagesContainer';
import DonationFurnitureContainer from './DonationFurnitureContainer';
import EmailModal from './EmailModal';
import { STATUSES } from '../../utils/config';

const { RESCHEDULE, PENDING, CHANGES_REQUESTED, SCHEDULED } = STATUSES;
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
      <Tag
        visibility={curStatus === RESCHEDULE && 'hidden'}
        size="sm"
        mt="1%"
        ml="1%"
        variant="solid"
        bgColor={colorMap[status]}
      >
        {/* <TagLabel fontSize={14}>{curStatus.toUpperCase()}</TagLabel> */}
        {curStatus.toUpperCase()}
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

  const deleteDonation = async () => {
    await PNPBackend.delete(`/donations/${id}`);
    setAllDonations(prev => prev.filter(donation => donation.id !== id));
    onClose();
  };

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
        <ModalHeader mr="1%" ml="1%" mb="0%">
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
            {currentStatus === RESCHEDULE && (
              <>
                <Alert status="warning" rounded="md" ml="10%" mt="-1%" mb="1%" width="45%">
                  <Flex direction="row" verticalAlign="center" align="center">
                    <AlertIcon ml="0.75%" boxSize="5.5%" />
                    <Flex direction="column" ml="0.75%">
                      <AlertTitle fontSize="md">Donor Rejected Scheduled Date</AlertTitle>
                      <AlertDescription fontSize="md" fontWeight="normal" mt="0.25%">
                        Please select a new date to continue.
                      </AlertDescription>
                    </Flex>
                  </Flex>
                </Alert>
              </>
            )}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="row" m={3}>
            <Box h="100%" w="60%" ml="1em" mr="1em" mb="1em" mt="-1.5em">
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
              <Text mt="2.5%" mb="0.75%" fontSize="1.25em" fontWeight="medium">
                Special Instructions
              </Text>
              <Textarea defaultValue={notes} isReadOnly />

              <Flex
                direction="row"
                bg="#E2E8F0"
                align="center"
                mt="1em"
                mv="0%"
                borderRadius={6}
                gap={5}
                px="3%"
                py="1%"
                mb="0%"
              >
                <Text fontSize="1.25em">Schedule</Text>
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

            <Box h="50%" w="40%" ml="1%" mr="1%">
              <Box>
                <Text mb="1%" fontSize="1.25em">
                  Images
                </Text>
                <DonationImagesContainer data={pictures} />
              </Box>

              <Box h="50%" w="100%">
                <Text mt="1%" mb="1%" fontSize="1.25em">
                  Furniture Items
                </Text>
                <DonationFurnitureContainer data={furniture} />
              </Box>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="space-between" ml="2%" mt="-1em">
          <Flex justify="left">
            <Button colorScheme="red" justifyContent="left" onClick={deleteDonation}>
              Delete Donation
            </Button>
          </Flex>
          <Flex mr="1%" justify="right">
            {(currentStatus === PENDING || currentStatus === CHANGES_REQUESTED) && (
              <>
                <Button
                  colorScheme="blue"
                  justify="right"
                  isDisabled={currentStatus === CHANGES_REQUESTED}
                  onClick={() => {
                    emailModalOnOpen();
                    setEmailStatus(REQUEST_CHANGES);
                  }}
                >
                  Request Changes
                </Button>
                <Button
                  ml="2%"
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
                ml="2%"
                colorScheme="red"
                onClick={() => {
                  emailModalOnOpen();
                  setEmailStatus(CANCEL_PICKUP);
                }}
              >
                Cancel Pickup
              </Button>
            )}
          </Flex>
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

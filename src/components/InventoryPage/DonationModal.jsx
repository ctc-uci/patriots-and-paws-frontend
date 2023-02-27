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
  Link,
  Select,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import { PropTypes } from 'prop-types';
import { PNPBackend, handleNavigateToAddress } from '../../utils/utils';
import { makeDate, colorMap, EMAILSTATUSES } from '../../utils/InventoryUtils';
import DonationImagesContainer from './DonationImagesContainer';
import DonationFurnitureContainer from './DonationFurnitureContainer';
import './InventoryPage.module.css';
import EmailModal from './EmailModal';
import { STATUSES } from '../../utils/config';

const DonationModal = ({ data, onClose, isOpen, setUsers }) => {
  const { PENDING, CHANGES_REQUESTED, SCHEDULED } = STATUSES;
  const { CANCEL_PICKUP, APPROVE, REQUEST_CHANGES } = EMAILSTATUSES;

  const {
    id,
    status,
    firstName,
    lastName,
    submittedDate,
    addressStreet,
    addressUnit,
    addressCity,
    email,
    phoneNum,
    notes,
    pictures,
    furniture,
    routeId,
    pickupDate,
  } = data;

  const [emailStatus, setEmailStatus] = useState('');
  const [currentStatus, setCurrentStatus] = useState(status);
  const [date, setDate] = useState('');
  // useEffect(() => console.log(data), [data]);
  // const [currentAddress, setCurrentAddress] = useState({
  //   addressStreet: '',
  //   addressUnit: '',
  //   addressCity: '',
  //   addressZip: '',
  // });
  console.log(pickupDate);
  useEffect(() => {
    setCurrentStatus(status);
  }, [data]);

  const {
    isOpen: isOpenEmailModal,
    onOpen: OnOpenEmailModal,
    onClose: onCloseEmailModal,
  } = useDisclosure();

  const updateDonationStatus = async newstatus => {
    setUsers(prev => prev.map(ele => (ele.id === id ? { ...ele, status: newstatus } : ele)));
    await PNPBackend.put(`/donations/${id}`, {
      status: newstatus,
    });
  };

  const fullname = `${firstName} ${lastName}`;

  const makeStatusTag = curstatus => {
    return (
      <Tag size="sm" m={5} ml={15} colorScheme={colorMap[curstatus]}>
        {curstatus}
      </Tag>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader m={3}>
          <Flex>
            <Text fontSize={36}>Donation #{id}</Text>
            {makeStatusTag(currentStatus)}
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
                  <Input placeholder="name" defaultValue={fullname} isRequired isDisabled />
                </InputGroup>
              </Stack>
              <Stack direction="row" my={2}>
                <InputGroup>
                  <InputLeftAddon>Email</InputLeftAddon>
                  <Input placeholder="email" defaultValue={email} isRequired isDisabled />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Phone Number</InputLeftAddon>
                  <Input
                    type="tel"
                    placeholder="phone number"
                    defaultValue={phoneNum}
                    isRequired
                    isDisabled
                  />
                </InputGroup>
              </Stack>
              <Text mt="60px" mb={5} fontSize="20px">
                Address
              </Text>
              <Stack spacing={3} direction="row">
                <InputGroup>
                  <InputLeftAddon>Street Address</InputLeftAddon>
                  <Input placeholder="street" defaultValue={addressStreet} isRequired isDisabled />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Unit</InputLeftAddon>
                  <Input placeholder="unit" defaultValue={addressUnit} isRequired isDisabled />
                </InputGroup>
              </Stack>
              <Stack spacing={3} direction="row" my={2}>
                <InputGroup>
                  <InputLeftAddon>City</InputLeftAddon>
                  <Input placeholder="city" defaultValue={addressCity} isRequired isDisabled />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>State</InputLeftAddon>
                  <Input placeholder="CA" isDisabled />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Zip Code</InputLeftAddon>
                </InputGroup>
              </Stack>
              <Text mt="60px" mb={5} fontSize="20px">
                Additional Comments
              </Text>
              <Textarea
                placeholder="Enter additional comments here"
                defaultValue={notes}
                isDisabled
              />
              {(currentStatus === APPROVED ||
                currentStatus === SCHEDULED ||
                currentStatus === SCHEDULING) && (
                <Grid templateRows="repeat(2, 1fr)" bg="#E2E8F0" spacing="40px">
                  <GridItem>
                    <Text mt="25px" mb={5} ml={5} fontSize="20px">
                      Schedule
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Select
                      mt="25px"
                      mb={5}
                      placeholder={!pickupDate && 'Choose a date'}
                      defaultValue={pickupDate ?? ''}
                      onChange={e => setDate(e.target.value)}
                      disabled={currentStatus !== APPROVED}
                    >
                      {Object.keys(routes).map(day => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Select mt="25px" mb={5} placeholder="Choose a route" disabled={!date}>
                      {date &&
                        routes[date].map(({ id: routeId, name }) => (
                          <option key={routeId} value={routeId}>
                            {name}
                          </option>
                        ))}
                    </Select>
                  </GridItem>
                </Grid>
              )}
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
            {currentStatus === PENDING || currentStatus === CHANGES_REQUESTED ? (
              <>
                <Button
                  colorScheme="red"
                  isDisabled={currentStatus === CHANGES_REQUESTED}
                  onClick={() => {
                    OnOpenEmailModal();
                    setEmailStatus(REQUEST_CHANGES);
                  }}
                >
                  Request Changes
                </Button>
                <Button
                  ml={3}
                  colorScheme="green"
                  onClick={() => {
                    OnOpenEmailModal();
                    setEmailStatus(APPROVE);
                  }}
                >
                  Approve
                </Button>
              </>
            ) : (
              ''
            )}
            {currentStatus === SCHEDULED && (
              <Button
                ml={3}
                colorScheme="red"
                onClick={() => {
                  OnOpenEmailModal();
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
          isOpenEmailModal={isOpenEmailModal}
          onCloseEmailModal={onCloseEmailModal}
          status={emailStatus}
          updateDonationStatus={updateDonationStatus}
          email={email}
          setCurrentStatus={setCurrentStatus}
        />
      </ModalContent>
    </Modal>
  );
};

DonationModal.propTypes = {
  setUsers: PropTypes.func,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  routes: PropTypes.func.isRequired,
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
  setUsers: () => {},
};

export default DonationModal;

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
} from '@chakra-ui/react';

import { PropTypes } from 'prop-types';
import { PNPBackend, handleNavigateToAddress } from '../../utils/utils';
import { makeDate, colorMap } from '../../utils/InventoryUtils';
import DonationImagesContainer from './DonationImagesContainer';
import DonationFurnitureContainer from './DonationFurnitureContainer';
import './InventoryPage.module.css';
import EmailModal from './EmailModal';
import STATUSES from '../../utils/config';

const DonationModal = ({ data, onClose, isOpen, setUsers }) => {
  const { PENDING, CHANGES_REQUESTED, SCHEDULED } = STATUSES.STATUSES;

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
  } = data;

  const [emailStatus, setEmailStatus] = useState('');
  const [currentStatus, setCurrentStatus] = useState(status);
  // const [currentAddress, setCurrentAddress] = useState({
  //   addressStreet: '',
  //   addressUnit: '',
  //   addressCity: '',
  //   addressZip: '',
  // });
  useEffect(() => {
    setCurrentStatus(status);
    // setCurrentAddress(() => {
    //   return {
    //     addressStreet,
    //     addressUnit,
    //     addressCity,
    //     addressZip,
    //   };
    // });
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

  // const googleMap = '';
  // if (addressStreet) {
  //   const addressArray = [addressStreet, addressUnit, addressCity, addressZip];
  //  const googleMap = handleNavigateToAddress([data]);
  // addressUnit !== ''
  //   ? `https://www.google.com/maps/search/?api=1&query=${addressStreet}, ${addressUnit}, ${addressCity}, CA, ${addressZip}`
  //   : `https://www.google.com/maps/search/?api=1&query=${addressStreet}, ${addressCity}, CA, ${addressZip}`;
  // }
  const googleMap =
    addressUnit !== ''
      ? `https://www.google.com/maps/search/?api=1&query=${addressStreet}, ${addressUnit}, ${addressCity}, CA, ${addressZip}`
      : `https://www.google.com/maps/search/?api=1&query=${addressStreet}, ${addressCity}, CA, ${addressZip}`;

  const makeStatusTag = curstatus => {
    return (
      <Tag size="xs" m={5} ml={15} colorScheme={colorMap[curstatus]}>
        {STATUSES[curstatus]}
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
                    setEmailStatus('request changes');
                  }}
                >
                  Request Changes
                </Button>
                <Button
                  ml={3}
                  colorScheme="green"
                  onClick={() => {
                    OnOpenEmailModal();
                    setEmailStatus('approve');
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
                  setEmailStatus('cancel pickup');
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
              onClick={handleNavigateToAddress([data])}
            >
              <Link href={googleMap} isExternal>
                Navigate to Address
              </Link>
            </Button>
          </Box>
        </ModalFooter>
        <EmailModal
          isOpenEmailModal={isOpenEmailModal}
          // OnOpenEmailModal={onOpenEmailModal}
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

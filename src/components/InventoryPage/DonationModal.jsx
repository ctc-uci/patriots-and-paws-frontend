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
  InputRightAddon,
  InputGroup,
  Textarea,
  Modal,
  useDisclosure,
  Link,
  Image,
} from '@chakra-ui/react';

import { PropTypes } from 'prop-types';
import { PNPBackend } from '../../utils/utils';
import { makeDate, getPictureFromDB } from '../../utils/InventoryUtils';
import ImageModal from './ImageModal';
import './InventoryPage.module.css';
import EmailModal from './EmailModal';
// import { getPictureFromDB } from '../../utils/InventoryUtils';

const DonationModal = ({ data, onClose, isOpen, setUsers }) => {
  // const dataCopy = data;
  const {
    id,
    status,
    firstName,
    submittedDate,
    addressStreet,
    addressUnit,
    addressCity,
    addressZip,
    email,
    phoneNum,
    notes,
  } = data;

  const [emailStatus, setEmailStatus] = useState('');
  const [currentStatus, setCurrentStatus] = useState(status);
  const {
    isOpen: isOpenImageModal,
    onOpen: onOpenImageModal,
    onClose: onCloseImageModal,
  } = useDisclosure();

  const {
    isOpen: isOpenEmailModal,
    onOpen: OnOpenEmailModal,
    onClose: onCloseEmailModal,
  } = useDisclosure();

  const [images, setImages] = useState([]);

  // useEffect(() => {}, []);

  // const [canEditInfo, setCanEditInfo] = useState(false);

  // const getImage = async () => {
  //   const result = await getPictureFromDB(id);
  //   setImage(result[0]);
  //   console.log(image);
  // };

  useEffect(() => {
    async function getImages() {
      const result = await getPictureFromDB(id);
      setImages(result);
    }
    getImages();
    setCurrentStatus(status);
  }, [data]);

  const updateDonationStatus = async newstatus => {
    setUsers(prev => prev.map(ele => (ele.id === id ? { ...ele, status: newstatus } : ele)));
    await PNPBackend.put(`/donations/${id}`, {
      status: newstatus,
    });
  };

  const googleMap =
    addressUnit !== ''
      ? `https://www.google.com/maps/search/?api=1&query=${addressStreet}, ${addressUnit}, ${addressCity}, CA, ${addressZip}`
      : `https://www.google.com/maps/search/?api=1&query=${addressStreet}, ${addressCity}, CA, ${addressZip}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader m={3}>
          <Flex>
            <Text fontSize={36}>Donation #{id}</Text>
            <Box>
              {currentStatus === 'pending' ? (
                <Button colorScheme="gray" m={5} ml={15} size="xs">
                  Pending
                </Button>
              ) : (
                ''
              )}
              {currentStatus === 'approved' && (
                <Button size="xs" m={5} ml={15} colorScheme="green">
                  Approved
                </Button>
              )}
              {currentStatus === 'changes requested' && (
                <Button size="xs" m={5} ml={15} colorScheme="blue">
                  Changes Requested
                </Button>
              )}
              {currentStatus === 'picked up' && (
                <Button size="xs" m={5} ml={15} colorScheme="green">
                  Picked Up
                </Button>
              )}
              {currentStatus === 'scheduled' && (
                <Button size="xs" m={5} ml={15} colorScheme="green">
                  Scheduled
                </Button>
              )}
              {currentStatus === 'archived' && (
                <Button size="xs" m={5} ml={15} colorScheme="blue">
                  Archived
                </Button>
              )}
            </Box>
            {/* <Button mt={5} ml={15} colorScheme="gray" size="xs">
              {status}
            </Button> */}
          </Flex>
          <Text fontSize={16}>Submission Date: {makeDate(submittedDate)}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="row" m={3}>
            <Box h={600} w="60%" m={5}>
              <Text mb={5} fontSize="20px">
                Basic Information
              </Text>
              <Stack spacing={3}>
                <InputGroup>
                  <InputLeftAddon>Name</InputLeftAddon>
                  <Input placeholder="name" defaultValue={firstName} isRequired isDisabled />
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
                defaultValues={notes}
                isDisabled
              />
            </Box>

            <Box h={600} w="40%" m={5} onClick={onOpenImageModal}>
              <Box>
                <Text mb={5} fontSize="20px">
                  Images
                </Text>
                {images.length > 0 && images.length < 4 ? (
                  <Image h={300} w={395} alt="test" src={images[0].imageUrl} />
                ) : (
                  <Box h={300} w={395} bg="gray" />
                )}
                <ImageModal
                  isOpenImageModal={isOpenImageModal}
                  onOpenImageModal={onOpenImageModal}
                  onCloseImageModal={onCloseImageModal}
                  image={images.length > 0 && images.length < 4 && images[0].imageUrl}
                />
              </Box>

              <Box h={400} w="70%">
                <Text mt="45px" mb={5} fontSize="20px">
                  Furniture Items
                </Text>
                <Stack>
                  <InputGroup>
                    <Input value="Dining Table" isDisabled />
                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>

                  <InputGroup>
                    <Input value="Dining Table" isDisabled />
                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>

                  <InputGroup>
                    <Input value="Dining Table" isDisabled />
                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>

                  <InputGroup>
                    <Input value="Dining Table" isDisabled />
                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>
                </Stack>
              </Box>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Box>
            {currentStatus === 'pending' || currentStatus === 'changes requested' ? (
              <>
                <Button
                  colorScheme="red"
                  isDisabled={currentStatus === 'changes requested'}
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
            {currentStatus === 'scheduled' && (
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
            <Button ml={3} colorScheme="gray" type="submit">
              <Link href={googleMap} isExternal>
                Navigate to Address
              </Link>
            </Button>
          </Box>
        </ModalFooter>
        <EmailModal
          isOpenEmailModal={isOpenEmailModal}
          OnOpenEmailModal={onOpenImageModal}
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
  setUsers: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    status: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    addressStreet: PropTypes.string.isRequired,
    addressUnit: PropTypes.string.isRequired,
    addressCity: PropTypes.string.isRequired,
    addressZip: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNum: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    submittedDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default DonationModal;

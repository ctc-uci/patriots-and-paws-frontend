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
} from '@chakra-ui/react';

import { PNPBackend } from '../../utils/utils';
// import { getPictureFromDB } from '../../utils/InventoryUntils';
import './InventoryPage.module.css';

const DonationModal = prop => {
  const { data, onClose, isOpen } = prop;
  // const [image, setImage] = useState([]);

  // useEffect(async () => {
  //   const result = await getPictureFromDB(id);
  //   setImage(result[0]);
  // }, []);

  const [donationData, setDonationData] = useState({ ...data });
  const [canEditInfo, setCanEditInfo] = useState(false);

  useEffect(() => {
    setDonationData(data);
  }, [data]);

  const updateDonationStatus = async (donationId, newstatus) => {
    PNPBackend.put(`/donations/${donationId}`, {
      status: newstatus,
    });
  };

  const updateDonation = async () => {
    PNPBackend.put(`/donations/${donationData.id}`, donationData);
  };

  function makeDate(dateDB) {
    const d = new Date(dateDB);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader m={3}>
          <Text fontSize={36}>Donation #{donationData.id}</Text>
          <Text fontSize={16}>Submission Date: {makeDate(donationData.submittedDate)}</Text>
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
                  <Input
                    defaultValue={donationData.firstName}
                    onChange={({ target }) => {
                      setDonationData(prev => ({ ...prev, firstName: target.value }));
                    }}
                    isDisabled={!canEditInfo}
                  />
                </InputGroup>
              </Stack>
              <Stack direction="row" my={2}>
                <InputGroup>
                  <InputLeftAddon>Email</InputLeftAddon>
                  <Input
                    placeholder="email"
                    defaultValue={donationData.email}
                    onChange={({ target }) => {
                      setDonationData(prev => ({ ...prev, email: target.value }));
                    }}
                    isDisabled={!canEditInfo}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Phone Number</InputLeftAddon>
                  <Input
                    type="tel"
                    placeholder="phone number"
                    defaultValue={donationData.phoneNum}
                    onChange={({ target }) => {
                      setDonationData(prev => ({ ...prev, phoneNum: target.value }));
                    }}
                    isDisabled={!canEditInfo}
                  />
                </InputGroup>
              </Stack>
              <Text mt="60px" mb={5} fontSize="20px">
                Address
              </Text>
              <Stack spacing={3} direction="row">
                <InputGroup>
                  <InputLeftAddon>Street Address</InputLeftAddon>
                  <Input
                    placeholder="street"
                    defaultValue={donationData.addressStreet}
                    onChange={({ target }) => {
                      setDonationData(prev => ({ ...prev, addressStreet: target.value }));
                    }}
                    isDisabled={!canEditInfo}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Unit</InputLeftAddon>
                  <Input
                    placeholder="unit"
                    defaultValue={donationData.addressUnit}
                    onChange={({ target }) => {
                      setDonationData(prev => ({ ...prev, addressUnit: target.value }));
                    }}
                    isDisabled={!canEditInfo}
                  />
                </InputGroup>
              </Stack>
              <Stack spacing={3} direction="row" my={2}>
                <InputGroup>
                  <InputLeftAddon>City</InputLeftAddon>
                  <Input
                    placeholder="city"
                    defaultValue={donationData.addressCity}
                    onChange={({ target }) => {
                      setDonationData(prev => ({ ...prev, addressCity: target.value }));
                    }}
                    isDisabled={!canEditInfo}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>State</InputLeftAddon>
                  <Input placeholder="state" isDisabled={!canEditInfo} />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Zip Code</InputLeftAddon>
                  <Input
                    placeholder="zip"
                    defaultValue={donationData.addressZip}
                    onChange={({ target }) => {
                      setDonationData(prev => ({ ...prev, addressZip: target.value }));
                    }}
                    isDisabled={!canEditInfo}
                  />
                </InputGroup>
              </Stack>
              <Text mt="60px" mb={5} fontSize="20px">
                Additional Comments
              </Text>
              <Textarea
                placeholder="Enter additional comments here"
                defaultValue={donationData.notes}
                onChange={({ target }) => {
                  setDonationData(prev => ({ ...prev, notes: target.value }));
                }}
                isDisabled={!canEditInfo}
              />
            </Box>
            <Box h={600} w="40%" m={5}>
              <Box>
                <Text mb={5} fontSize="20px">
                  Images
                </Text>
                <Box h={300} w={395} bg="gray">
                  {/* {image ? image.imageUrl : 'no image provided'} */}
                </Box>
              </Box>

              <Box h={400} w="70%">
                <Text mt="45px" mb={5} fontSize="20px">
                  Furniture Items
                </Text>
                <Stack>
                  <InputGroup>
                    <Input value="Dining Table" />
                    {/* isDisabled={true}  */}
                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>

                  <InputGroup>
                    <Input value="Dining Table" />
                    {/* isDisabled={true}  */}

                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>

                  <InputGroup>
                    <Input value="Dining Table" />
                    {/* isDisabled={true}  */}

                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>

                  <InputGroup>
                    <Input value="Dining Table" />
                    {/* isDisabled={true}  */}

                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>
                </Stack>
              </Box>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Box>
            <Button
              colorScheme="red"
              onClick={() => {
                updateDonationStatus(donationData.id, 'denied');
              }}
            >
              Reject
            </Button>
            <Button
              ml={3}
              colorScheme="gray"
              onClick={() => {
                updateDonationStatus(donationData.id, 'flagged');
              }}
            >
              Flag
            </Button>
            <Button
              ml={3}
              colorScheme="green"
              onClick={() => {
                updateDonationStatus(donationData.id, 'approved');
              }}
            >
              Approve
            </Button>
          </Box>
          <Box>
            {!canEditInfo ? (
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  setCanEditInfo(true);
                }}
              >
                Edit Information
              </Button>
            ) : (
              <>
                <Button
                  ml={3}
                  colorScheme="gray"
                  onClick={() => {
                    setCanEditInfo(false);
                    // donationOnClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  ml={3}
                  colorScheme="blue"
                  onClick={() => {
                    updateDonation();
                    setCanEditInfo(false);
                  }}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DonationModal;

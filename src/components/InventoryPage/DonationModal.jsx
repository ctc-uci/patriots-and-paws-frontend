import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

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
  useDisclosure,
  Tr,
  Modal,
  Td,
} from '@chakra-ui/react';

import { PNPBackend } from '../../utils/utils';
import { getPictureFromDB } from '../../utils/InventoryUntils';
import './InventoryPage.module.css';
// import updateDonationStatus from '../../utils/InventoryUntils';

const DonationModal = prop => {
  const { props } = prop;
  const {
    id,
    addressStreet,
    addressUnit,
    addressCity,
    addressZip,
    firstName,
    lastName,
    email,
    phoneNum,
    notes,
    submittedDate,
    status,
  } = props;

  const [image, setImage] = useState([]);

  useEffect(async () => {
    const result = await getPictureFromDB(id);
    setImage(result[0]);
    // console.log(result[0]);
  }, []);

  // console.log(props);
  // console.log(id);

  const [canEditInfo, setCanEditInfo] = useState(false);
  const [first, setFirstName] = useState(firstName);
  // const [last, setLastName] = useState(lastName);
  const [newemail, setEmail] = useState(email);
  const [phone, setPhoneNum] = useState(phoneNum);
  const [street, setStreet] = useState(addressStreet);
  const [unit, setUnit] = useState(addressUnit);
  const [city, setCity] = useState(addressCity);
  const [zip, setZip] = useState(addressZip);
  const [newnote, setNotes] = useState(notes);

  // const {
  //   isOpen: donationIsOpen,
  //   onOpen: donationOnOpen,
  //   onClose: donationOnClose,
  // } = useDisclosure();
  // const { isOpen: imageIsOpen, onOpen: imageOnOpen, onClose: imageOnClose } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const reloadPage = () => {
    window.location.reload(true);
  };

  const updateDonationStatus = async (donationId, newstatus) => {
    PNPBackend.put(`/donations/${donationId}`, {
      status: newstatus,
    }).then(() => {
      reloadPage();
    });
  };

  // const updateFurniture = async () => {
  //   PNPBackend.put(`/furniture/${furnitureId}`, {
  //     name: furniturename,
  //   }).then(() => {
  //     reloadPage();
  //   });
  // };

  const updateDonation = async () => {
    PNPBackend.put(`/donations/${id}`, {
      firstName: first,
      // lastName: last,
      email: newemail,
      phoneNum: phone,
      addressCity: city,
      addressZip: zip,
      addressStreet: street,
      addressUnit: unit,
      notes: newnote,
    }).then(() => {
      reloadPage();
    });
  };

  function makeStatus(newStatus) {
    if (newStatus === 'denied') {
      return (
        <Button size="xs" colorScheme="red">
          REJECTED
        </Button>
      );
    }
    if (newStatus === 'approved') {
      return (
        <Button size="xs" colorScheme="green">
          APPROVED
        </Button>
      );
    }
    if (newStatus === 'flagged') {
      return (
        <Button size="xs" colorScheme="gray">
          FLAGGED
        </Button>
      );
    }
    return (
      <Button size="xs" colorScheme="gray">
        {newStatus}
      </Button>
    );
  }

  function makeDate(dateDB) {
    const d = new Date(dateDB);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  // console.log(image);
  return (
    <Tr onClick={onOpen} key={id}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="90%" minH="90%">
          <ModalHeader m={3}>
            <Text fontSize={36}>Donation #{id}</Text>
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
                    <Input
                      defaultValue={first}
                      onChange={({ target }) => {
                        setFirstName(target.value);
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
                      defaultValue={newemail}
                      onChange={({ target }) => {
                        setEmail(target.value);
                      }}
                      isDisabled={!canEditInfo}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>Phone Number</InputLeftAddon>
                    <Input
                      type="tel"
                      placeholder="phone number"
                      defaultValue={phone}
                      onChange={({ target }) => {
                        setPhoneNum(target.value);
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
                      defaultValue={street}
                      onChange={({ target }) => {
                        setStreet(target.value);
                      }}
                      isDisabled={!canEditInfo}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>Unit</InputLeftAddon>
                    <Input
                      placeholder="unit"
                      defaultValue={unit}
                      onChange={({ target }) => {
                        setUnit(target.value);
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
                      defaultValue={city}
                      onChange={({ target }) => {
                        setCity(target.value);
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
                      defaultValue={zip}
                      onChange={({ target }) => {
                        setZip(target.value);
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
                  defaultValue={newnote}
                  onChange={({ target }) => {
                    setNotes(target.value);
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
                    {image ? image.imageUrl : 'no image provided'}
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
                  updateDonationStatus(id, 'denied');
                }}
              >
                Reject
              </Button>
              <Button
                ml={3}
                colorScheme="gray"
                onClick={() => {
                  updateDonationStatus(id, 'flagged');
                }}
              >
                Flag
              </Button>
              <Button
                ml={3}
                colorScheme="green"
                onClick={() => {
                  updateDonationStatus(id, 'approved');
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
                  <Button ml={3} colorScheme="blue" onClick={updateDonation}>
                    Save Changes
                  </Button>
                </>
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Td>
        <Text>{`${first} ${lastName}`}</Text>
        <Text color="#718096">{newemail}</Text>
      </Td>
      <Td>#{id}</Td>
      <Td>{makeStatus(status)}</Td>
      <Td>{makeDate(submittedDate)}</Td>
    </Tr>
  );
};

DonationModal.propTypes = {
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
  status: PropTypes.string.isRequired,
};

export default DonationModal;

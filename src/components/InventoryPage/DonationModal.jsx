import React, { useState } from 'react';

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
} from '@chakra-ui/react';

import './InventoryPage.module.css';

const DonationModal = () => {
  // add back "Props" para
  // const { OnClose } = { props };
  const [canEditInfo, setCanEditInfo] = useState(false);

  return (
    <>
      <ModalOverlay />
      <ModalContent maxW="90%" minH="90%">
        <ModalHeader m={3}>
          {/* <Text fontSize={36}>{props.ele.id}</Text> */}
          <Text fontSize={16}>Submission Date: January 9th 2023</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="row" m={3}>
            <Box h={600} w="60%" m={10}>
              <Text mb={10} fontSize="20px">
                Basic Information
              </Text>
              <Stack spacing={3}>
                <Stack spacing={3}>
                  <InputGroup>
                    <InputLeftAddon>Name</InputLeftAddon>
                    <Input value="dang" isDisabled={!canEditInfo} />
                  </InputGroup>
                </Stack>
                <Stack direction="row">
                  <InputGroup>
                    <InputLeftAddon>Email</InputLeftAddon>
                    <Input placeholder="email" isDisabled={!canEditInfo} />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>Phone Number</InputLeftAddon>
                    <Input type="tel" placeholder="phone number" isDisabled={!canEditInfo} />
                  </InputGroup>
                </Stack>
                <Text mb={15} mt={15} fontSize="20px">
                  Address
                </Text>
                <Stack spacing={3} direction="row">
                  <InputGroup>
                    <InputLeftAddon>Street Address</InputLeftAddon>
                    <Input placeholder="street" isDisabled={!canEditInfo} />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>Unit</InputLeftAddon>
                    <Input placeholder="unit" isDisabled={!canEditInfo} />
                  </InputGroup>
                </Stack>
                <Stack spacing={3} direction="row">
                  <InputGroup>
                    <InputLeftAddon>City</InputLeftAddon>
                    <Input placeholder="city" isDisabled={!canEditInfo} />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>State</InputLeftAddon>
                    <Input placeholder="state" isDisabled={!canEditInfo} />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>Zip Code</InputLeftAddon>
                    <Input placeholder="zip" isDisabled={!canEditInfo} />
                  </InputGroup>
                </Stack>
                <Text m={3} fontSize="20px">
                  Additional Comments
                </Text>
                <Input placeholder="Enter additional comments here" />
              </Stack>
            </Box>
            <Box h={600} w="40%">
              <Box>
                Images
                <Box h={200} w={200} bg="gray">
                  img
                </Box>
              </Box>

              <Box h={400} w={400}>
                Funiture Items
                <Stack spacing={4}>
                  <InputGroup>
                    <Input value="Dining Table" />
                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>

                  <InputGroup>
                    <Input value="Dining Table" />
                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>

                  <InputGroup>
                    <Input value="Dining Table" />
                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>

                  <InputGroup>
                    <Input value="Dining Table" />
                    <InputRightAddon>2</InputRightAddon>
                  </InputGroup>
                </Stack>
              </Box>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Box>
            <Button colorScheme="red">Reject</Button>
            <Button ml={3} colorScheme="gray">
              Flag
            </Button>
            <Button ml={3} colorScheme="green">
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
                  }}
                >
                  Cancel
                </Button>
                <Button ml={3} colorScheme="blue">
                  Save Changes
                </Button>
              </>
            )}
            {/* <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setCanEditInfo(true);
              }}
            >
              Edit Information
            </Button> */}
          </Box>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default DonationModal;

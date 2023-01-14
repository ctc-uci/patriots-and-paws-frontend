import React from 'react';

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

const DonationModal = props => {
  const { onClose } = { props };
  return (
    <>
      <ModalOverlay />
      <ModalContent maxW="90%" minH="90%">
        <ModalHeader m={3}>
          <Text fontSize={36}>Donation #123456789</Text>
          <Text fontSize={16}>Submission Date: January 9th 2023</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="row" m={3}>
            <Box h={600} w="60%">
              Basic Information
              <Stack spacing={4}>
                <InputGroup>
                  <InputLeftAddon>Name</InputLeftAddon>
                  <Input placeholder="name" />
                </InputGroup>
              </Stack>
              <Stack spacing={8} direction="row">
                <InputGroup>
                  <InputLeftAddon>Email</InputLeftAddon>
                  <Input placeholder="email" />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Phone Number</InputLeftAddon>
                  <Input type="tel" placeholder="phone number" />
                </InputGroup>
              </Stack>
              Addresssssss
              <Stack spacing={8} direction="row">
                <InputGroup>
                  <InputLeftAddon>Street Address</InputLeftAddon>
                  <Input placeholder="street" />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Unit</InputLeftAddon>
                  <Input placeholder="unit" />
                </InputGroup>
              </Stack>
              <Stack spacing={8} direction="row">
                <InputGroup>
                  <InputLeftAddon>City</InputLeftAddon>
                  <Input placeholder="city" />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>State</InputLeftAddon>
                  <Input placeholder="state" />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Zip Code</InputLeftAddon>
                  <Input placeholder="zip" />
                </InputGroup>
              </Stack>
              Additional Comments
              <Input placeholder="Enter additional comments here" />
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
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Edit Information
          </Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default DonationModal;

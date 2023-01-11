import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

const DonationModal = () => {
  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>hi</ModalBody>

        <ModalFooter>
          {/* <Button colorScheme="blue" mr={3} onClick={props.onClose}>
            Close
          </Button> */}
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default DonationModal;

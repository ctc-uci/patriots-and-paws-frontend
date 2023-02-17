import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Heading,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

const ItemInfo = ({ items, isAccepted = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Preview</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Furniture Pickup</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading as="h2" size="m">
              Items We Accept
            </Heading>
            <UnorderedList>
              {items
                .filter(({ accepted }) => accepted === isAccepted)
                .map(({ name }) => (
                  <ListItem key={name}>{name}</ListItem>
                ))}
            </UnorderedList>

            <Heading as="h2" size="m">
              Items We DO NOT Accept
            </Heading>
            <UnorderedList>
              {items
                .filter(({ accepted }) => accepted === !isAccepted)
                .map(({ name }) => (
                  <ListItem key={name}>{name}</ListItem>
                ))}
            </UnorderedList>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemInfo;

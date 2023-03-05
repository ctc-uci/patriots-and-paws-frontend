import React from 'react';
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
  Box,
  Flex,
} from '@chakra-ui/react';

import { PropTypes } from 'prop-types';

const ItemInfo = ({ items, isAccepted = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button bg="white" border="1px solid #E2E8F0;" onClick={onOpen}>
        Preview Item List
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent padding="2em">
          <ModalHeader>
            <Heading as="h1" size="lg">
              Furniture Pickup
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading as="h2" size="md">
              Items We Accept
            </Heading>
            <Box paddingLeft=".5em" height="15em" overflowY="auto" marginY=".5em">
              <UnorderedList>
                <Flex flexWrap="wrap">
                  {items
                    .filter(({ accepted }) => accepted === isAccepted)
                    .map(({ name }) => (
                      <ListItem key={name} width="50%">
                        {name}
                      </ListItem>
                    ))}
                </Flex>
              </UnorderedList>
            </Box>

            <Flex>
              <Heading as="h2" size="md">
                Items We
              </Heading>
              <Heading as="h2" color="red" size="md">
                &nbsp;DO NOT&nbsp;
              </Heading>
              <Heading as="h2" size="md">
                Accept
              </Heading>
            </Flex>
            <Box paddingLeft=".5em" height="15em" overflowY="auto" marginY=".5em">
              <UnorderedList>
                <Flex flexWrap="wrap">
                  {items
                    .filter(({ accepted }) => accepted === !isAccepted)
                    .map(({ name }) => (
                      <ListItem key={name} width="50%">
                        {name}
                      </ListItem>
                    ))}
                </Flex>
              </UnorderedList>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

ItemInfo.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      accepted: PropTypes.bool,
    }),
  ).isRequired,
  isAccepted: PropTypes.bool.isRequired,
};

export default ItemInfo;

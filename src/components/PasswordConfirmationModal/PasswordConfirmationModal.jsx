import React from 'react';
import { PropTypes } from 'prop-types';
import {
  Button,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  VStack,
  Text,
  Flex,
  Box,
  HStack,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

const PasswordConfirmationModal = ({ isOpen, onClose }) => {
  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Flex>
        <ModalContent p={16}>
          <ModalHeader>
            <VStack>
              <Box bg="blue.100" borderRadius="full" p={10} mb={5}>
                <CheckIcon boxSize={16} />
              </Box>
              <Text fontWeight="700" fontSize="36px">
                Your password has been set!
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <VStack>
            <ModalBody mt={-5} textAlign="center" color="#2D3748" fontSize="20px">
              Access your account by clicking on the button below.
            </ModalBody>
            <ModalFooter>
              <HStack width="100%" gap={5} marginTop={10}>
                <Button colorScheme="blue" flex={1} px={10} onClick={onClose}>
                  Log into my account
                </Button>
              </HStack>
            </ModalFooter>
          </VStack>
        </ModalContent>
      </Flex>
    </Modal>
  );
};

PasswordConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
}.isRequired;

export default PasswordConfirmationModal;

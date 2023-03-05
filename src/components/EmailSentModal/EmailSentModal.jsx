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
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const EmailSentModal = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Flex>
        <ModalContent p={3}>
          <ModalHeader>
            <VStack>
              <CheckCircleIcon boxSize={10} color="green.500" />
              <Text fontWeight="bold">Email Sent!</Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <VStack>
            <ModalBody textAlign="center">
              Didn&apos;t receive an email? Resend it by clicking the button below or exit out and
              enter a different email.
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                paddingTop={6}
                paddingRight={3}
                paddingBottom={6}
                paddingLeft={3}
                onClick={onSubmit}
              >
                Resend Email
              </Button>
            </ModalFooter>
          </VStack>
        </ModalContent>
      </Flex>
    </Modal>
  );
};

EmailSentModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}.isRequired;

export default EmailSentModal;

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
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';

const EmailSentModal = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Flex>
        <ModalContent p={3}>
          <ModalHeader>
            <VStack>
              <Box bg="blue.100" borderRadius="full" p={5}>
                <EmailIcon boxSize={12} />
              </Box>
              <Text fontWeight="bold">Reset Password Email has been sent!</Text>
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

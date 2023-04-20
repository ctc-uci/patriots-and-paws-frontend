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
import { EmailIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const EmailSentModal = ({ isOpen, onClose, onSubmit }) => {
  const navigate = useNavigate();

  const handleClickGotIt = () => {
    navigate('/login');
  };

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Flex>
        <ModalContent p={16}>
          <ModalHeader>
            <VStack>
              <Box bg="blue.100" borderRadius="full" p={10}>
                <EmailIcon boxSize={16} />
              </Box>
              <Text fontWeight="700" fontSize="36px">
                Reset Password Email has been sent!
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <VStack>
            <ModalBody mt={-5} textAlign="center" color="#2D3748" fontSize="18px">
              You will receive an email shortly to set up your new password.
            </ModalBody>
            <ModalFooter>
              <HStack width="100%" gap={5} marginTop={10}>
                <Button variant="outline" onClick={onSubmit} flex={1} px={10}>
                  Resend email
                </Button>
                <Button colorScheme="blue" flex={1} px={10} onClick={handleClickGotIt}>
                  Got it
                </Button>
              </HStack>
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

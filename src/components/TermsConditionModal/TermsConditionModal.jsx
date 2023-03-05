import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Checkbox,
} from '@chakra-ui/react';

import { PropTypes } from 'prop-types';
import { CheckIcon } from '@chakra-ui/icons';

const TermsConditionModal = ({ onClose, isOpen, isDonationForm = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Terms &amp; Conditions</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum
          </Text>
        </ModalBody>
        {!isDonationForm && (
          <ModalFooter justifyContent="space-between">
            <Checkbox>I accept the Terms and Conditions*</Checkbox>

            <Button bg="#319747" color="white">
              Approve Time&nbsp;
              <CheckIcon />
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

TermsConditionModal.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  isDonationForm: PropTypes.bool.isRequired,
};

TermsConditionModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
};
export default TermsConditionModal;

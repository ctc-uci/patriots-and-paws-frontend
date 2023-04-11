import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';

import { PropTypes } from 'prop-types';

const TermsConditionModal = ({ onClose, isOpen }) => {
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
      </ModalContent>
    </Modal>
  );
};

TermsConditionModal.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
};

TermsConditionModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
};
export default TermsConditionModal;

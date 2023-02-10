import React from 'react';
import './InventoryPage.module.css';
import {
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Modal,
  Box,
} from '@chakra-ui/react';
import { PropTypes } from 'prop-types';

const ImageModal = ({ isOpenImageModal, onCloseImageModal }) => {
  return (
    <>
      <Modal isOpen={isOpenImageModal} onClose={onCloseImageModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box h={500} w="35%" bg="gray" my={50} mx="auto" />
            <Textarea placeholder="Image description" isDisabled />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

ImageModal.propTypes = {
  isOpenImageModal: PropTypes.bool.isRequired,
  onCloseImageModal: PropTypes.func.isRequired,
};
export default ImageModal;

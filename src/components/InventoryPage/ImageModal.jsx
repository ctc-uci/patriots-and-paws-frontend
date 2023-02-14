import React from 'react';
import './InventoryPage.module.css';
import {
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Modal,
  Image,
} from '@chakra-ui/react';
import { PropTypes } from 'prop-types';

const ImageModal = ({ isOpenImageModal, onCloseImageModal, image }) => {
  return (
    <>
      <Modal isOpen={isOpenImageModal} onClose={onCloseImageModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Image h={500} w="35%" my={50} mx="auto" src={image} />
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
  image: PropTypes.string.isRequired,
};
export default ImageModal;

import React from 'react';
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
  const { imageUrl, notes } = image;
  return (
    <>
      <Modal isOpen={isOpenImageModal} onClose={onCloseImageModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Image h={500} w="35%" my={50} mx="auto" src={imageUrl} />
            <Textarea defaultValue={notes} isReadOnly />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

ImageModal.propTypes = {
  isOpenImageModal: PropTypes.bool.isRequired,
  onCloseImageModal: PropTypes.func.isRequired,
  image: PropTypes.shape({
    imageUrl: PropTypes.string,
    notes: PropTypes.string,
  }),
};

ImageModal.defaultProps = {
  image: {},
};
export default ImageModal;

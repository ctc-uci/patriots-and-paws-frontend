import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Center,
  Textarea,
  Modal,
  Image,
} from '@chakra-ui/react';
import { PropTypes } from 'prop-types';

const ImageModal = ({ isOpenImageModal, onCloseImageModal, image }) => {
  const { imageUrl, notes } = image;
  return (
    <>
      <Modal
        isOpen={isOpenImageModal}
        onClose={onCloseImageModal}
        size={{ base: 'md', md: '2xl' }}
        BlockScrollOnMount
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody align="center">
            <Center my={50}>
              <Image width="100%" height="100%" objectFit="contain" src={imageUrl} />
            </Center>
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

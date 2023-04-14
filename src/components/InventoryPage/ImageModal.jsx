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
        size="full"
        scroll="no"
        BlockScrollOnMount
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody align="center">
            <Center w="30rem" h="30rem">
              <Image objectFit="contain" src={imageUrl} />
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

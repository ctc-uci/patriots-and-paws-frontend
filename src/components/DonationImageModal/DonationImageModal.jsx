import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Modal,
  Image,
  Text,
} from '@chakra-ui/react';
import { PropTypes } from 'prop-types';

const DonationImageModal = ({ isOpenImageModal, onCloseImageModal, image }) => {
  const { imageUrl, fileName } = image;
  return (
    <>
      <Modal isOpen={isOpenImageModal} onClose={onCloseImageModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text fontStyle="normal" fontWeight={700} fontSize="20px">
              {fileName}
            </Text>
            <Image mx="auto" mt={30} src={imageUrl} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

DonationImageModal.propTypes = {
  isOpenImageModal: PropTypes.bool.isRequired,
  onCloseImageModal: PropTypes.func.isRequired,
  image: PropTypes.shape({
    imageUrl: PropTypes.string,
    fileName: PropTypes.string,
  }),
};

DonationImageModal.defaultProps = {
  image: {},
};
export default DonationImageModal;

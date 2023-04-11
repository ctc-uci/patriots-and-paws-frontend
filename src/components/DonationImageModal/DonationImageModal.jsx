import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Modal,
  Image,
  Text,
  Center,
} from '@chakra-ui/react';
import { PropTypes } from 'prop-types';

const DonationImageModal = ({ isOpenImageModal, onCloseImageModal, image }) => {
  const { imageUrl, fileName } = image;
  return (
    <>
      <Modal isOpen={isOpenImageModal} onClose={onCloseImageModal} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text fontStyle="normal" fontWeight={700} fontSize="20px">
              {fileName}
            </Text>
            <Center>
              <Image boxSize="30em" objectFit="contain" src={imageUrl} />
            </Center>
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

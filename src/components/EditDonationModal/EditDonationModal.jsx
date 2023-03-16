import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import DonationForm from '../DonationForm/DonationForm';

const EditDonationModal = ({ donationData, isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Donation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DonationForm donationData={donationData} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

EditDonationModal.propTypes = {
  donationData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    addressStreet: PropTypes.string,
    addressCity: PropTypes.string,
    addressUnit: PropTypes.string,
    addressZip: PropTypes.number,
    phoneNum: PropTypes.string,
    email: PropTypes.string,
    notes: PropTypes.string,
    furniture: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        count: PropTypes.number,
      }),
    ),
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditDonationModal;

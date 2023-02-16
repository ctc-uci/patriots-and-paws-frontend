import React from 'react';
import { PropTypes } from 'prop-types';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import { PNPBackend } from '../../utils/utils';

const DeleteAccountModal = ({
  staffProfile,
  isOpen,
  onClose,
  setAllUsers,
  setAdminUsers,
  setDriverUsers,
}) => {
  const onSubmit = () => {
    try {
      PNPBackend.delete(`/users/${staffProfile.id}`);
      onClose();
      setAllUsers(prev => prev.filter(user => user.id !== staffProfile.id));
      if (staffProfile.role === 'admin') {
        setAdminUsers(prev => prev.filter(user => user.id !== staffProfile.id));
      } else {
        setDriverUsers(prev => prev.filter(user => user.id !== staffProfile.id));
      }
    } catch (err) {
      // const errorCode = err.code;
      // const firebaseErrorMsg = err.message;
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Staff Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this staff member? You can not undo this action
            afterwards.
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onSubmit}>
              Delete Staff Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

DeleteAccountModal.propTypes = {
  staffProfile: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.string,
      lastName: PropTypes.string,
      phoneNumber: PropTypes.string,
      role: PropTypes.string,
    }),
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setAllUsers: PropTypes.func.isRequired,
  setAdminUsers: PropTypes.func.isRequired,
  setDriverUsers: PropTypes.func.isRequired,
};

export default DeleteAccountModal;

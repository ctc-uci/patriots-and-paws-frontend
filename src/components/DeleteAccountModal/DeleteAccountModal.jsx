import React from 'react';
import { PropTypes } from 'prop-types';
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
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
  const onSubmit = async () => {
    try {
      await PNPBackend.delete(`/users/${staffProfile.id}`);
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
      // console.log(err);
    }
  };
  const cancelRef = React.useRef();

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Staff Member
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this staff member? You can not undo this action
              afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onSubmit} ml={3}>
                Delete Staff Member
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

DeleteAccountModal.propTypes = {
  staffProfile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setAllUsers: PropTypes.func.isRequired,
  setAdminUsers: PropTypes.func.isRequired,
  setDriverUsers: PropTypes.func.isRequired,
};

export default DeleteAccountModal;

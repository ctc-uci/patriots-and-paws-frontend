import React from 'react';
import { PropTypes } from 'prop-types';
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  ModalBody,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

const EditAccountModal = ({ memberType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton onClick={onOpen} icon={<EditIcon />} variant="ghost" />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit {memberType}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            CHANGE TEXT - Are you sure you want to delete this{' '}
            {memberType === 'Staff' ? 'staff member' : 'driver'}? You can not undo this afterwards.
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

EditAccountModal.propTypes = {
  memberType: PropTypes.string.isRequired,
};

export default EditAccountModal;

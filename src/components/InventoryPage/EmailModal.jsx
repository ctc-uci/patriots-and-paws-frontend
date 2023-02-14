import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';

import { Email, Item, Span } from 'react-html-email';

import { PropTypes } from 'prop-types';
import { sendEmail } from '../../utils/utils';

function CancelModal({ isOpenCancelModal, onCloseCancelModal, onCloseEmailModal, handleSubmit }) {
  return (
    <Modal isOpen={isOpenCancelModal} onClose={onCloseCancelModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure you want to cancel?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button colorScheme="red" mr={3} onClick={onCloseCancelModal}>
            Exit
          </Button>
          <Button
            colorScheme="green"
            mr={3}
            onClick={e => {
              onCloseEmailModal();
              onCloseCancelModal();
              handleSubmit(e);
            }}
          >
            Send Email
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function EmailModal({
  isOpenEmailModal,
  onCloseEmailModal,
  status,
  updateDonationStatus,
  email,
  setCurrentStatus,
}) {
  const {
    isOpen: isOpenCancelModal,
    onOpen: OnOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const [newMessage, setNewMessage] = useState();
  const [emailTemp, setEmailTemp] = useState('');
  const [makeModalContent, setMakeModalContent] = useState({
    makeModalHeader: '',
    makeModalBody: '',
  });

  function updateMessage(event) {
    setNewMessage(event.target.value);
  }

  const emailTemplate = (
    <Email title={status}>
      <Item align="center">
        <Span fontSize={15}>
          <p>{emailTemp}</p>
          <p>{newMessage}</p>
        </Span>
      </Item>
    </Email>
  );

  const handleSubmit = event => {
    event.preventDefault();
    sendEmail(email, emailTemplate);
  };

  useEffect(() => {
    if (status === 'cancel pickup') {
      setEmailTemp(
        'Unfortunately, we have CANCELLED your pickup for this day. You can either reschedule your pickup or cancel it altogether. Please provide this information through the Donation Dashboard at this link.',
      );
      setMakeModalContent({
        makeModalHeader: 'Cancel Pickup',
        makeModalBody:
          'Unfortunately, we have CANCELLED your pickup for this day. You can either reschedule your pickup or cancel it altogether. Please provide this information through the Donation Dashboard at this link.',
      });
    } else if (status === 'request changes') {
      setEmailTemp(
        'Dear Patriots and Paws Donor, We have requested changes to your donation form due to reasons listed before. We have listed the items that we don’t accept below. Please remove these items from your donation form so that we can proceed with the donation pickup. Feel free to email us at patriotsandpaws@gmail.com or call us at [pnp number] for more information or assistance.',
      );
      setMakeModalContent({
        makeModalHeader: '[ACTION REQUIRED] Changes Requested',
        makeModalBody:
          'Dear Patriots and Paws Donor, We have requested changes to your donation form due to reasons listed before. We have listed the items that we don’t accept below. Please remove these items from your donation form so that we can proceed with the donation pickup. Feel free to email us at patriotsandpaws@gmail.com or call us at [pnp number] for more information or assistance.',
      });
    } else if (status === 'approve') {
      setEmailTemp(
        'Thank you for filling out the Donation form! We have approved your donation and are working on scheduling a pickup day. Once a pickup day has been picked on our side, you will get an email to approve or reject the scheduled day. Once again, thank you for supporting our veterans!',
      );
      setMakeModalContent({
        makeModalHeader: 'Approve Donation',
        makeModalBody:
          'Thank you for filling out the Donation form! We have approved your donation and are working on scheduling a pickup day. Once a pickup day has been picked on our side, you will get an email to approve or reject the scheduled day. Once again, thank you for supporting our veterans!',
      });
    } else if (status === 'scheduled') {
      setMakeModalContent({
        makeModalHeader: 'Schedule Pickup',
        makeModalBody:
          'We have scheduled your donation pickup for February 8th, 2023. Please navigate to the Donation Dashboard using this link in order to accept or reschedule your pickup. If you have any questions or concerns, email patriotsandpaws@gmail.com.',
      });
    }
  }, [status]);

  return (
    <>
      {/* <Button onClick={onEmailOpen}>Open Modal</Button> */}

      <Modal isOpen={isOpenEmailModal} onClose={onCloseEmailModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={30} fontSize={36}>
            {makeModalContent.makeModalHeader}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody mt={5}>
            <br />
            <Box bg="#E2E8F0" mr={79} ml={79}>
              <br />
              <Box p={20} mr={20} ml={20} mt={20} bg="#EDF1F8">
                <Text fontSize={22}>Dear Patriots and Paws Donor,</Text>
                <br />
                <Text fontSize={22}>{makeModalContent.makeModalBody}</Text>
              </Box>
              <Box mr={20} ml={20} mt={2} mb={20} bg="#EDF1F8">
                <Textarea
                  onChange={e => {
                    updateMessage(e);
                  }}
                  bg="white"
                  size="lg"
                  placeholder="Write message here"
                  on
                />
              </Box>
              <br />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                OnOpenCancelModal();
              }}
            >
              Cancel
            </Button>
            <CancelModal
              isOpenCancelModal={isOpenCancelModal}
              onCloseEmailModal={onCloseEmailModal}
              onCloseCancelModal={onCloseCancelModal}
              handleSubmit={handleSubmit}
            />
            {status === 'cancel pickup' ? (
              <Button
                colorScheme="red"
                onClick={e => {
                  handleSubmit(e);
                  updateDonationStatus('approved');
                  setCurrentStatus('approved');
                  onCloseEmailModal();
                }}
              >
                Send Cancellation Email
              </Button>
            ) : (
              ''
            )}
            {(status === 'request changes' || status === 'scheduled') && (
              <Button
                colorScheme="blue"
                onClick={e => {
                  handleSubmit(e);
                  updateDonationStatus('changes requested');
                  setCurrentStatus('changes requested');
                  onCloseEmailModal();
                }}
              >
                Send Email
              </Button>
            )}
            {status === 'approve' && (
              <Button
                colorScheme="green"
                onClick={e => {
                  handleSubmit(e);
                  updateDonationStatus('approved');
                  setCurrentStatus('approved');
                  onCloseEmailModal();
                }}
              >
                Send Approval Email
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

EmailModal.propTypes = {
  updateDonationStatus: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onCloseEmailModal: PropTypes.func.isRequired,
  isOpenEmailModal: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  setCurrentStatus: PropTypes.func.isRequired,
};

CancelModal.propTypes = {
  isOpenCancelModal: PropTypes.bool.isRequired,
  onCloseCancelModal: PropTypes.func.isRequired,
  onCloseEmailModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default EmailModal;

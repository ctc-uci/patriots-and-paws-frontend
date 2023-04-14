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
  Flex,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { Email, Item, Span } from 'react-html-email';

import { PropTypes } from 'prop-types';
import { sendEmail, PNPBackend } from '../../utils/utils';
import { EMAIL_TYPE, makeDate } from '../../utils/InventoryUtils';
import { STATUSES } from '../../utils/config';

const { CANCEL_PICKUP, APPROVE, REQUEST_CHANGES, SCHEDULED, DELETE_DONATION } = EMAIL_TYPE;
const { SCHEDULING, CHANGES_REQUESTED, RESCHEDULE } = STATUSES;

const makeSendButton = (
  status,
  handleSubmit,
  updateDonation,
  setCurrentStatus,
  onCloseEmailModal,
  onCloseCancelModal,
  routeInfo,
  isConfirmationSendEmail = false,
) => {
  const { id: donationId, scheduledRouteId: routeId, scheduledDate: pickupDate } = routeInfo;
  const toast = useToast();

  const handleApproveDonation = async e => {
    handleSubmit(e);
    await PNPBackend.post('/donations/assign-route', { donationId, routeId });
    updateDonation({ newStatus: SCHEDULING, newPickupDate: pickupDate, newRouteId: routeId });
    setCurrentStatus(SCHEDULING);
    onCloseEmailModal();
    onCloseCancelModal();
    toast({
      title: `Scheduled #${donationId}.`,
      description: 'Successfully scheduled donation for pickup.',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
      variant: 'subtle',
    });
  };

  if (status === CANCEL_PICKUP) {
    return (
      <Button
        colorScheme={isConfirmationSendEmail ? 'green' : 'red'}
        onClick={e => {
          handleSubmit(e);
          updateDonation({ newStatus: RESCHEDULE });
          setCurrentStatus(RESCHEDULE);
          onCloseEmailModal();
          onCloseCancelModal();
          toast({
            title: `Cancelled #${donationId}.`,
            description: "You've cancelled this pickup.",
            status: 'info',
            duration: 2000,
            isClosable: true,
            position: 'top',
            variant: 'subtle',
          });
        }}
      >
        {isConfirmationSendEmail ? 'Send Email' : 'Send Cancellation Email'}
      </Button>
    );
  }
  if (status === REQUEST_CHANGES || status === SCHEDULED) {
    return (
      <Button
        colorScheme={isConfirmationSendEmail ? 'green' : 'blue'}
        onClick={e => {
          handleSubmit(e);
          updateDonation({ newStatus: CHANGES_REQUESTED });
          setCurrentStatus(CHANGES_REQUESTED);
          onCloseEmailModal();
          onCloseCancelModal();
          toast({
            title: `Changes Requested for #${donationId}.`,
            description: 'Email has been sent for changes to be made by the Donor.',
            status: 'info',
            duration: 2000,
            isClosable: true,
            position: 'top',
            variant: 'subtle',
          });
        }}
      >
        Send Email
      </Button>
    );
  }

  if (status === APPROVE) {
    return (
      <Button
        colorScheme="green"
        onClick={e => {
          handleApproveDonation(e);
        }}
      >
        {isConfirmationSendEmail ? 'Send Email' : 'Send Approval Email'}
      </Button>
    );
  }
  return <></>;
};

const CancelModal = ({ isOpenCancelModal, onCloseCancelModal, emailButton }) => {
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
          {emailButton}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const EmailModal = ({
  isOpenEmailModal,
  onCloseEmailModal,
  status,
  updateDonation,
  email,
  setCurrentStatus,
  donationInfo,
}) => {
  const {
    isOpen: isOpenCancelModal,
    onOpen: OnOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const [newMessage, setNewMessage] = useState('');
  const [modalContent, setModalContent] = useState({
    header: '',
    body: '',
  });

  const updateMessage = event => {
    setNewMessage(event.target.value);
  };

  const emailTemplate = (
    <Email title={status}>
      <Item>
        <Span fontSize={15}>
          <p>{modalContent?.body}</p>
          <p>{newMessage}</p>
        </Span>
      </Item>
    </Email>
  );

  const handleSubmit = event => {
    event.preventDefault();
    sendEmail(modalContent.header, email, emailTemplate);
  };

  const sendEmailButton = makeSendButton(
    status,
    handleSubmit,
    updateDonation,
    setCurrentStatus,
    onCloseEmailModal,
    onCloseCancelModal,
    donationInfo,
    false,
  );

  const confirmationSendEmailButton = makeSendButton(
    status,
    handleSubmit,
    updateDonation,
    setCurrentStatus,
    onCloseEmailModal,
    onCloseCancelModal,
    donationInfo,
    true,
  );

  const getEmailContent = (emailStatus, donationData) => {
    const { scheduledDate, id } = donationData;
    const mapping = {
      [DELETE_DONATION]: {
        header: 'Delete Donation',
        body: (
          <>
            <Text>
              Unfortunately, we have DELETED your donation due to the reasons listed below. You can
              either reschedule your pickup or cancel it altogether. Please provide this information
              through the Donor Dashboard at this link.
            </Text>
            <br />
            <Text as="b">Donation ID: #{id}</Text>
          </>
        ),
      },
      [CANCEL_PICKUP]: {
        header: 'Cancel Pickup',
        body: (
          <>
            <Text>
              Unfortunately, we have CANCELED your pickup for this day due to the reasons listed
              below. You can either reschedule your pickup or cancel it altogether. Please provide
              this information through the Donor Dashboard at this link.
            </Text>
            <br />
            <Text as="b">Donation ID: #{id}</Text>
          </>
        ),
      },
      [REQUEST_CHANGES]: {
        header: '[ACTION REQUIRED] Changes Requested',
        body: (
          <Text>
            We have requested changes to your donation form due to reasons listed below. We have
            listed the items that we don’t accept below. Please remove these items from your
            donation form so that we can proceed with the donation pickup. Feel free to email us at
            patriotsandpaws@gmail.com or call us at [pnp number] for more information or assistance.
          </Text>
        ),
      },
      [APPROVE]: {
        header: 'Donation Approved',
        body: (
          <>
            <Text>
              Thank you for filling out the Donation form! We have approved your donation and have
              scheduled it for <Text as="b">{makeDate(scheduledDate.replace('-', '/'))}</Text>.
              Please follow the link provided below and login with the Donation ID and your email
              address to approve or reject the scheduled day. Once again, thank you for supporting
              our veterans!
            </Text>
            <br />
            <Text as="b">Donation ID: #{id}</Text>
          </>
        ),
      },
      // [SCHEDULED]: {
      //   header: 'Schedule Pickup',
      //   body: (
      //     <Text>
      //       We have scheduled your donation pickup for <Text></Text>. Please navigate to the Donation
      //       Dashboard using this link in order to accept or reschedule your pickup. If you have any
      //       questions or concerns, email patriotsandpaws@gmail.com.
      //     </Text>
      //   ),
      // },
    };
    return mapping[emailStatus];
  };

  useEffect(() => {
    setModalContent({ ...getEmailContent(status, donationInfo) });
  }, [status, donationInfo]);

  return (
    <Modal isOpen={isOpenEmailModal} onClose={onCloseEmailModal} size="full">
      <ModalOverlay />
      <ModalContent p={10}>
        <ModalHeader fontSize={36}>
          <Text as="b">{modalContent?.header}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={10} bg="#E2E8F0" px={10} py="5em">
            <Box fontSize={22}>
              <Text>Dear Patriots and Paws Donor,</Text>
              <br />
              {modalContent?.body}
            </Box>
            <Textarea
              onChange={e => {
                updateMessage(e);
              }}
              bg="white"
              size="lg"
              placeholder="Write message here"
              py={10}
              h="10em"
            />
          </Flex>
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
            emailButton={confirmationSendEmailButton}
          />
          {sendEmailButton}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

EmailModal.propTypes = {
  updateDonation: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onCloseEmailModal: PropTypes.func,
  isOpenEmailModal: PropTypes.bool,
  email: PropTypes.string,
  setCurrentStatus: PropTypes.func,
  donationInfo: PropTypes.shape({
    donationId: PropTypes.number,
    routeDate: PropTypes.string,
    routeId: PropTypes.string,
  }),
};

EmailModal.defaultProps = {
  email: '',
  isOpenEmailModal: false,
  onCloseEmailModal: () => {},
  setCurrentStatus: () => {},
  donationInfo: {},
};

CancelModal.propTypes = {
  isOpenCancelModal: PropTypes.bool.isRequired,
  onCloseCancelModal: PropTypes.func.isRequired,
  emailButton: PropTypes.node,
};

CancelModal.defaultProps = {
  emailButton: <></>,
};

export default EmailModal;

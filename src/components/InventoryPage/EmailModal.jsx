import React, { useRef } from 'react';
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
} from '@chakra-ui/react';

import { Email, Item, Span } from 'react-html-email';

import { PropTypes } from 'prop-types';
import { sendEmail } from '../../utils/utils';
import { EMAIL_TYPE, makeDate } from '../../utils/InventoryUtils';
import SendButton from './SendButton';

const { CANCEL_PICKUP, APPROVE, REQUEST_CHANGES, DELETE_DONATION } = EMAIL_TYPE;

const getEmailContent = (status, date, id) => {
  switch (status) {
    case DELETE_DONATION:
      return {
        header: 'Delete Donation',
        body: (
          <Text>Unfortunately, we have DELETED your donation due to the reasons listed below.</Text>
        ),
      };
    case CANCEL_PICKUP:
      return {
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
      };
    case REQUEST_CHANGES:
      return {
        header: '[ACTION REQUIRED] Changes Requested',
        body: (
          <Text>
            We have requested changes to your donation form due to reasons listed below. We have
            listed the items that we don’t accept below. Please remove these items from your
            donation form so that we can proceed with the donation pickup. Feel free to email us at
            patriotsandpaws@gmail.com or call us at [pnp number] for more information or assistance.
          </Text>
        ),
      };
    case APPROVE:
      return {
        header: 'Donation Approved',
        body: (
          <>
            <Text>
              Thank you for filling out the Donation form! We have approved your donation and have
              scheduled it for <Text as="b">{makeDate(date.replace('-', '/'))}</Text>. Please follow
              the link provided below and login with the Donation ID and your email address to
              approve or reject the scheduled day. Once again, thank you for supporting our
              veterans!
            </Text>
            <br />
            <Text as="b">Donation ID: #{id}</Text>
          </>
        ),
      };
    default:
      return {
        header: 'ERROR',
        body: <Text>Email Status is Invalid</Text>,
      };
  }
};

const emailTemplate = (status, body, additionalText) => (
  <Email title={status}>
    <Item>
      <Span fontSize={15}>
        <p>{body}</p>
        <br />
        <p>{additionalText}</p>
      </Span>
    </Item>
  </Email>
);

const EmailModal = ({
  isOpenEmailModal,
  onCloseEmailModal,
  status,
  updateDonation,
  email,
  setCurrentStatus,
  donationInfo: { id: donationId, scheduledDate: routeDate, scheduledRouteId: routeId },
  onDeleteDonation,
  onCloseDonationModal,
}) => {
  const emailBodyRef = useRef({ value: '' });

  const { header, body } = getEmailContent(status, routeDate, donationId);

  const handleSubmit = e => {
    e.preventDefault();
    sendEmail(header, email, emailTemplate(status, body, emailBodyRef.current.value));
    onCloseDonationModal();
  };

  return (
    <Modal isOpen={isOpenEmailModal} onClose={onCloseEmailModal} size="xl">
      <ModalOverlay />
      <ModalContent p={10}>
        <ModalHeader fontSize={36}>
          <Text as="b">{header}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={10} bg="#E2E8F0" px={10} py="5em">
            <Box fontSize={22}>
              <Text>Dear Patriots and Paws Donor,</Text>
              <br />
              {body}
            </Box>
            <Textarea
              bg="white"
              size="lg"
              placeholder="Write message here"
              py={10}
              h="10em"
              ref={emailBodyRef}
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onCloseEmailModal}>
            Cancel
          </Button>
          <SendButton
            status={status}
            handleSubmit={handleSubmit}
            updateDonation={updateDonation}
            setCurrentStatus={setCurrentStatus}
            onCloseEmailModal={onCloseEmailModal}
            donationInfo={{ donationId, routeDate, routeId }}
            onDeleteDonation={onDeleteDonation}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

EmailModal.propTypes = {
  updateDonation: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onCloseEmailModal: PropTypes.func.isRequired,
  isOpenEmailModal: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  setCurrentStatus: PropTypes.func.isRequired,
  donationInfo: PropTypes.shape({
    id: PropTypes.string,
    scheduledDate: PropTypes.string,
    scheduledRouteId: PropTypes.string,
  }).isRequired,
  onDeleteDonation: PropTypes.func.isRequired,
  onCloseDonationModal: PropTypes.func.isRequired,
};

export default EmailModal;

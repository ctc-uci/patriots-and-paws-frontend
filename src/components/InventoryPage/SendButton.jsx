import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import { PNPBackend } from '../../utils/utils';
import { STATUSES } from '../../utils/config';
import { EMAIL_TYPE } from '../../utils/InventoryUtils';

const { CANCEL_PICKUP, APPROVE, REQUEST_CHANGES, DELETE_DONATION } = EMAIL_TYPE;
const { CHANGES_REQUESTED, RESCHEDULE, SCHEDULING } = STATUSES;

const ON_SUBMIT_DETAILS = {
  [APPROVE]: {
    newStatus: SCHEDULING,
    toastTitle: 'Scheduled',
    toastText: 'Successfully scheduled donation for pickup.',
    buttonText: 'Send Approval Email',
    colorScheme: 'green',
  },
  [REQUEST_CHANGES]: {
    newStatus: CHANGES_REQUESTED,
    toastTitle: 'Changes Requested for',
    toastText: 'Email has been sent for changes to be made by the donor',
    buttonText: 'Send Email',
    colorScheme: 'blue',
  },
  [CANCEL_PICKUP]: {
    newStatus: RESCHEDULE,
    toastTitle: 'Cancelled',
    toastText: "You've cancelled this pickup",
    buttonText: 'Send Cancellation Email',
    colorScheme: 'red',
  },
  [DELETE_DONATION]: {
    toastTitle: 'Deleted',
    toastText: "You've deleted this donation",
    buttonText: 'Send Deletion Email',
    colorScheme: 'red',
  },
};

const SendButton = ({
  status,
  handleSubmit,
  updateDonation,
  setCurrentStatus,
  onCloseEmailModal,
  donationInfo: { donationId, routeId, pickupDate },
  onDeleteDonation,
}) => {
  const toast = useToast();

  const { newStatus, toastTitle, toastText, buttonText, colorScheme } = ON_SUBMIT_DETAILS[status];

  const handleSendEmail = async e => {
    handleSubmit(e);

    if (status === APPROVE) {
      await PNPBackend.post('/donations/assign-route', { donationId, routeId });
    }

    if (status !== DELETE_DONATION) {
      updateDonation({
        newStatus,
        ...(status === APPROVE && { newPickupDate: pickupDate, newRouteId: routeId }),
      });
    } else {
      onDeleteDonation();
    }

    setCurrentStatus(newStatus);

    onCloseEmailModal();
    toast.closeAll();
    toast({
      title: `${toastTitle} #${donationId}.`,
      description: toastText,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
      variant: 'subtle',
    });
  };

  return (
    <Button colorScheme={colorScheme} onClick={handleSendEmail}>
      {buttonText}
    </Button>
  );
};

SendButton.propTypes = {
  status: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  updateDonation: PropTypes.func.isRequired,
  setCurrentStatus: PropTypes.func.isRequired,
  onCloseEmailModal: PropTypes.func.isRequired,
  donationInfo: PropTypes.shape({
    donationId: PropTypes.string,
    routeId: PropTypes.string,
    pickupDate: PropTypes.string,
  }).isRequired,
  onDeleteDonation: PropTypes.func.isRequired,
};

export default SendButton;

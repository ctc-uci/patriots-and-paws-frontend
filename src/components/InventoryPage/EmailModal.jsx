import React from 'react';
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
} from '@chakra-ui/react';

// import { Email, Item, Span, A } from 'react-html-email';

import { PropTypes } from 'prop-types';
// import { sendEmail } from '../../utils/utils';

function EmailModal({ isOpenEmailModal, onCloseEmailModal, status, updateDonationStatus }) {
  // const [newEmail, setNewEmail] = useState();
  // const [emailTemp, setEmailTemp] = useState('');

  // function updateEmail(event) {
  //   setNewEmail(event.target.value);
  // }

  // const handleSubmit = event => {
  //   event.preventDefault();
  //   sendEmail(newEmail, emailTemplate);
  // };

  // const emailTemplate = (
  //   <Email title={status}>
  //     <Item align="center">
  //       <Span fontSize={20}>
  //         This is an example email made with:
  //         <A href="https://github.com/chromakode/react-html-email">react-html-email</A>.
  //       </Span>
  //     </Item>
  //   </Email>
  // );

  // useEffect(() => {
  //   if (status === 'scheduled') {
  //     setEmailTemp(
  //       'Dear Patriots and Paws Donor, We have scheduled your donation pickup for\n February 8th, 2023. Please navigate to the Donation Dashboard using this link in\n order to accept or reschedule your pickup. If you have any questions or\n concerns, email patriotsandpaws@gmail.com.',
  //     );
  //   } else if (status === 'request changes') {
  //     setEmailTemp(
  //       'Dear Patriots and Paws Donor, We have requested changes to your donation form due to reasons listed before. We have listed the items that we don’t accept below. Please remove these items from your donation form so that we can proceed with the donation pickup. Feel free to email us at patriotsandpaws@gmail.com or call us at [pnp number] for more information or assistance.',
  //     );
  //   }
  // }, []);

  return (
    <>
      {/* <Button onClick={onEmailOpen}>Open Modal</Button> */}

      <Modal isOpen={isOpenEmailModal} onClose={onCloseEmailModal} size="full">
        <ModalOverlay />
        <ModalContent>
          {status === 'cancel pickup' ? <ModalHeader fontSize={36}>Cancel Pickup</ModalHeader> : ''}
          {status === 'request changes' && (
            <ModalHeader fontSize={36}>[ACTION REQUIRED] Changes Requested</ModalHeader>
          )}
          {status === 'approve' && <ModalHeader fontSize={36}>Approve Donation</ModalHeader>}
          {status === 'scheduled' && <ModalHeader fontSize={36}>Schedule Pickup</ModalHeader>}
          <ModalCloseButton />
          {status === 'scheduled' ? (
            <ModalBody>
              <Box h="400px" w="100%" bg="#EDF1F8">
                <Box h="300px" w="95%" bg="#E2E8F0">
                  <Text>
                    Dear Patriots and Paws Donor, We have scheduled your donation pickup for
                    February 8th, 2023. Please navigate to the Donation Dashboard using this link in
                    order to accept or reschedule your pickup. If you have any questions or
                    concerns, email patriotsandpaws@gmail.com.
                  </Text>
                  <Textarea bg="white" placeholder="Write message here" />
                </Box>
              </Box>
            </ModalBody>
          ) : (
            ''
          )}
          {status === 'request changes' && (
            <ModalBody>
              <Box h="400px" w="100%" bg="#EDF1F8">
                <Box h="300px" w="95%" bg="#E2E8F0">
                  <Text>
                    Dear Patriots and Paws Donor, We have requested changes to your donation form
                    due to reasons listed before. We have listed the items that we don’t accept
                    below. Please remove these items from your donation form so that we can proceed
                    with the donation pickup. Feel free to email us at patriotsandpaws@gmail.com or
                    call us at [pnp number] for more information or assistance.
                  </Text>
                </Box>
                <Textarea bg="white" placeholder="Write message here" />
              </Box>
            </ModalBody>
          )}
          {status === 'approve' && (
            <ModalBody>
              <Box h="400px" w="100%" bg="#EDF1F8">
                <Box h="300px" w="95%" bg="#E2E8F0">
                  <Text>
                    Dear Patriots and Paws Donor, Thank you for filling out the Donation form! We
                    have approved your donation and are working on scheduling a pickup day. Once a
                    pickup day has been picked on our side, you will get an email to approve or
                    reject the scheduled day. Once again, thank you for supporting our veterans!
                  </Text>
                </Box>
                <Textarea bg="white" placeholder="Write message here" />
              </Box>
            </ModalBody>
          )}
          {status === 'cancel pickup' && (
            <ModalBody>
              <Box h="400px" w="100%" bg="#EDF1F8">
                <Box h="300px" w="95%" bg="#E2E8F0">
                  <Text>
                    Dear Patriots and Paws Donor, Unfortunately, we have CANCELLED your pickup for
                    this day. You can either reschedule your pickup or cancel it altogether. Please
                    provide this information through the Donation Dashboard at this link.
                  </Text>
                </Box>
                <Textarea bg="white" placeholder="Write message here" />
              </Box>
            </ModalBody>
          )}
          <ModalFooter>
            <Button variant="ghost">Cancel</Button>
            {status === 'cancel pickup' ? (
              <Button
                colorScheme="red"
                onClick={() => {
                  updateDonationStatus('approved');
                }}
              >
                Send Cancellation Email
              </Button>
            ) : (
              ''
            )}
            {status === 'request changes' ||
              (status === 'scheduled' && (
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    updateDonationStatus('changes requested');
                  }}
                >
                  Send Email
                </Button>
              ))}
            {status === 'approve' && (
              <Button
                colorScheme="green"
                onClick={() => {
                  updateDonationStatus('approved');
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
};

export default EmailModal;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Grid,
  Box,
  Text,
  Button,
  Tag,
  Link,
  Flex,
  Checkbox,
  useDisclosure,
  useToast,
  Image,
} from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { getDonationData } from '../../utils/DonorUtils';
import DonorFooter from '../DonorFooter/DonorFooter';
import TrackDonationSection from '../TrackDonationSection/TrackDonationSection';
import DonationDetails from './DonationDetails';
import { STATUSES } from '../../utils/config';
import { PNPBackend, formatDate } from '../../utils/utils';
import TermsConditionModal from '../TermsConditionModal/TermsConditionModal';
import pickedUpImage from '../../assets/pickedUpCarImage.png';

const {
  PENDING,
  SCHEDULING,
  SCHEDULED,
  CHANGES_REQUESTED,
  PICKED_UP,
  APPROVAL_REQUESTED,
  RESCHEDULE,
} = STATUSES;

const DonorDashboard = ({ donationId }) => {
  const [donation, setDonation] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const tAndCRef = useRef(0);
  const toast = useToast();

  const navigate = useNavigate();

  const displayBanner = () => {
    switch (donation.status) {
      case PENDING:
      case APPROVAL_REQUESTED:
        return (
          <Flex borderRadius="6px" bg="blue.50" w="100%" p={4} mb={4}>
            <CheckCircleIcon color="blue.100" mr={2} boxSize={5} />
            <Box>
              Your donation has been successfully submitted and will be reviewed shortly! Be sure to
              check your inbox for updates and email us at&nbsp;
              <Link href="mailto:pnp@gmail.com" color="blue.500" textDecoration="underline">
                pnp@gmail.com
              </Link>
              &nbsp;with any changes.
            </Box>
          </Flex>
        );
      case CHANGES_REQUESTED:
        return (
          <Flex borderRadius="6px" bg="orange.100" w="100%" p={4} mb={4}>
            <WarningIcon color="orange.500" mr={2} boxSize={5} />
            <Box>
              Your donation requires adjustments. Check your email to see what changes are needed
              and edit your form accordingly.
            </Box>
          </Flex>
        );
      case PICKED_UP:
        return (
          <Flex borderRadius="6px" bg="green.50" w="100%" p={4} mb={4} color="black">
            <CheckCircleIcon color="green.500" mr={2} boxSize={5} />
            <Box>Thank you for donating to Patriots and Paws!</Box>
          </Flex>
        );
      default:
        return (
          <Flex borderRadius="6px" bg="green.50" w="100%" p={4} mb={4} color="black">
            <CheckCircleIcon color="green.500" mr={2} boxSize={5} />
            <Box>Your donation has been approved! Be sure to schedule your pick up time.</Box>
          </Flex>
        );
    }
  };

  const handleRejectTime = async () => {
    setDonation(prev => ({ ...prev, status: RESCHEDULE }));

    await PNPBackend.put(`/donations/${donation.id}`, {
      status: RESCHEDULE,
    });

    toast({
      title: 'Pickup Day Rejected',
      status: 'info',
      duration: 4000,
      isClosable: true,
      position: 'top',
    });
  };

  const handleAcceptTime = async () => {
    if (!tAndCRef.current.checked) {
      toast({
        title: 'Error.',
        description: 'Please agree to the terms and conditions',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    setDonation(prev => ({ ...prev, status: SCHEDULED }));

    await PNPBackend.put(`/donations/${donation.id}`, {
      status: SCHEDULED,
    });

    toast({
      title: 'Scheduled!',
      description: 'Your pickup time has been scheduled.',
      status: 'success',
      duration: 4000,
      isClosable: true,
      position: 'top',
    });
  };

  const displayPickup = () => {
    switch (donation.status) {
      case PENDING:
      case RESCHEDULE:
      case APPROVAL_REQUESTED:
        return (
          <Box>
            Sit Tight! We&apos;ll be scheduling a pickup date with you soon.
            <Flex gap={3} visibility="hidden">
              <Button bg="red.500" color="white">
                Reject Time
                <CloseIcon ml={3} />
              </Button>
              <Button bg="green" color="white">
                Approve Time
                <CheckIcon ml={3} />
              </Button>
            </Flex>
          </Box>
        );
      case SCHEDULING:
        return (
          <Flex direction="column" gap={3}>
            <Text>Proposed Day:</Text>
            <Text as="b">{formatDate(donation.pickupDate)}</Text>
            <Flex>
              <Checkbox ref={tAndCRef} mr={2} />
              <Text>I accept the&nbsp;</Text>
              <Text as="b" onClick={onOpen} _hover={{ cursor: 'pointer' }}>
                Terms and Conditions
              </Text>
            </Flex>
            <TermsConditionModal onClose={onClose} isOpen={isOpen} />
            <Flex gap={3}>
              <Button bg="red.500" color="white" onClick={handleRejectTime}>
                Reject Time
                <CloseIcon ml={3} />
              </Button>
              <Button bg="green" color="white" onClick={handleAcceptTime}>
                Approve Time
                <CheckIcon ml={3} />
              </Button>
            </Flex>
          </Flex>
        );
      case SCHEDULED:
        return (
          <Flex direction="column" gap={3}>
            <Flex gap={3} align="center">
              <Text>Pickup Day Confirmed</Text>
              <CheckCircleIcon color="green.200" />
            </Flex>
            <Text as="b">{formatDate(donation.pickupDate)}</Text>
            <Text>Instructions:</Text>
            <Flex gap={3} visibility="hidden">
              <Button bg="red.500" color="white">
                Reject Time
                <CloseIcon ml={3} />
              </Button>
              <Button bg="green" color="white">
                Approve Time
                <CheckIcon ml={3} />
              </Button>
            </Flex>
          </Flex>
        );
      case CHANGES_REQUESTED:
        return (
          <Box>
            After submitting your changes, we&apos;ll be scheduling a pickup date with you soon.
          </Box>
        );
      case PICKED_UP:
        return (
          <Flex align="center" h="100%" direction="column" justify="center" gap={2}>
            <Image src={pickedUpImage} mx={15} />
            Your items has been successfully picked up!
          </Flex>
        );
      default:
        return <Box>No pickup</Box>;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDonationData(donationId);
      setDonation(data);
    };
    fetchData();
  }, [donationId]);

  return (
    <>
      <Flex bg="gray.200" p={6} direction="column" gap={7}>
        <Grid gap={10} templateColumns="3fr 1fr">
          <Flex direction="column" gap={3}>
            <Text fontSize="1.5em" fontWeight="700">
              My Donation
            </Text>
            {displayBanner()}
            <Box borderRadius="6px" bg="white" w="100%" h="100%" overflowY="auto" p={6}>
              <DonationDetails data={donation} setDonationData={setDonation} />
            </Box>
          </Flex>
          <Flex direction="column" gap={3} display={{ base: 'none', md: 'block' }}>
            <Flex direction="row" gap={3}>
              <Text fontSize="1.5em" fontWeight="700">
                Pick Up
              </Text>
              <Box p={2}>
                {donation.status === SCHEDULING && (
                  <Tag bg="blue.200" color="white">
                    New
                  </Tag>
                )}
              </Box>
            </Flex>
            <Box borderRadius="6px" bg="white" h="100%" py={4} px={6}>
              {displayPickup()}
            </Box>
          </Flex>
        </Grid>
        <Flex direction="column" gap={3} display={{ base: 'block', md: 'none' }}>
          <Flex direction="row" gap={3}>
            <Text fontSize="1.5em" fontWeight="700">
              Pick Up
            </Text>
            <Box p={2}>
              {donation.status === SCHEDULING && (
                <Tag bg="blue.200" color="white">
                  New
                </Tag>
              )}
            </Box>
          </Flex>
          <Box borderRadius="6px" bg="white" h="100%" py={4} px={6}>
            {displayPickup()}
          </Box>
        </Flex>
        <Flex direction="column">
          <Text fontSize="1.5em" fontWeight="700" mb="20px">
            Track your donation
          </Text>
          {donation?.status && <TrackDonationSection status={donation.status} />}
        </Flex>
        <Button
          bg="red.500"
          color="white"
          onClick={() => {
            navigate('/donate', {
              state: {},
            });
            navigate(0);
          }}
        >
          Logout
        </Button>
      </Flex>
      <DonorFooter />
    </>
  );
};

DonorDashboard.propTypes = {
  donationId: PropTypes.string.isRequired,
};

export default DonorDashboard;

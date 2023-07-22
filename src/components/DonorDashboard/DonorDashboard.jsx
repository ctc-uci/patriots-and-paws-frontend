import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Box,
  Text,
  Button,
  Tag,
  Link,
  Flex,
  Checkbox,
  useDisclosure,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { FaTruckPickup } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { getDonationData } from '../../utils/DonorUtils';
import DonorFooter from '../DonorFooter/DonorFooter';
import TrackDonationSection from '../TrackDonationSection/TrackDonationSection';
import { DonationDetails, displayStatusTag } from './DonationDetails';
import { STATUSES } from '../../utils/config';
import { PNPBackend } from '../../utils/utils';
import TermsConditionModal from '../TermsConditionModal/TermsConditionModal';
import { formatDate, standardizeDate } from '../../utils/RouteUtils';

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

  const displayBanner = () => {
    switch (donation.status) {
      case PENDING:
      case APPROVAL_REQUESTED:
        return (
          <Flex borderRadius="6px" bg="blue.50" w="100%" p={4}>
            <CheckCircleIcon color="blue.100" mr={2} boxSize={5} />
            <Box>
              Your donation has been successfully submitted and will be reviewed shortly! Be sure to
              check your inbox for updates and email us at&nbsp;
              <Link
                href="mailto:pickup@patriotsandpaws.org"
                color="blue.500"
                textDecoration="underline"
              >
                pickup@patriotsandpaws.org
              </Link>
              &nbsp;with any changes.
            </Box>
          </Flex>
        );
      case CHANGES_REQUESTED:
        return (
          <Flex borderRadius="6px" bg="orange.100" w="100%" p={4}>
            <WarningIcon color="orange.500" mr={2} boxSize={5} />
            <Box>
              Your donation requires adjustments. Check your email to see what changes are needed
              and edit your form accordingly.
            </Box>
          </Flex>
        );
      case PICKED_UP:
        return (
          <Flex borderRadius="6px" bg="green.50" w="100%" p={4} color="black">
            <CheckCircleIcon color="green.500" mr={2} boxSize={5} />
            <Box>Thank you for donating to Patriots and Paws!</Box>
          </Flex>
        );
      case RESCHEDULE:
        return (
          <Flex borderRadius="6px" bg="blue.50" w="100%" p={4}>
            <CheckCircleIcon color="blue.100" mr={2} boxSize={5} />
            <Box>
              Your pickup is being rescheduled! Be sure to check your inbox for updates and email us
              at&nbsp;
              <Link href="mailto:pnp@gmail.com" color="blue.500" textDecoration="underline">
                pnp@gmail.com
              </Link>
              &nbsp;with any changes.
            </Box>
          </Flex>
        );
      default:
        return (
          <Flex borderRadius="6px" bg="green.50" w="100%" p={4} color="black">
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

    toast.closeAll();
    toast({
      title: 'Pickup Day Rejected',
      status: 'info',
      duration: 4000,
      isClosable: true,
      position: 'top',
      variant: 'subtle',
    });
  };

  const handleAcceptTime = async () => {
    if (!tAndCRef.current.checked) {
      toast.closeAll();
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

    toast.closeAll();
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
      case APPROVAL_REQUESTED:
        return (
          <Flex flexDir="column">
            <Heading
              fontWeight="700"
              fontSize="20px"
              mb="20px"
              display={{ base: 'block', md: 'none' }}
            >
              Pickup
            </Heading>
            <Box>
              Sit Tight! We&apos;ll be scheduling a pickup date with you soon.
              <Flex gap={3} visibility="hidden">
                <Button colorScheme="red">
                  Reject Time
                  <CloseIcon ml={3} />
                </Button>
                <Button colorScheme="green">
                  Approve Time
                  <CheckIcon ml={3} />
                </Button>
              </Flex>
            </Box>
          </Flex>
        );
      case SCHEDULING:
        return (
          <Flex direction="column" gap={3} textAlign="left">
            <Text fontWeight="400" fontSize="lg" mb="15px" mt={0}>
              Proposed Day:
              <Text fontWeight="600" fontSize="lg">
                {formatDate(new Date(standardizeDate(donation.pickupDate)))}
              </Text>
            </Text>
            <Flex mb="15px">
              <Checkbox ref={tAndCRef} mr="13px" />
              <Text fontSize="sm">I accept the&nbsp;</Text>
              <Text fontSize="sm" as="b" onClick={onOpen} _hover={{ cursor: 'pointer' }}>
                Terms and Conditions&nbsp;
              </Text>
              <Text fontSize="sm" color="red">
                *
              </Text>
            </Flex>
            <TermsConditionModal onClose={onClose} isOpen={isOpen} />
            <Flex columnGap={5} w="100%">
              <Button colorScheme="red" onClick={handleRejectTime}>
                Reject Time
                <CloseIcon ml={{ base: 1, md: 3 }} boxSize={3} />
              </Button>
              <Button colorScheme="green" onClick={handleAcceptTime}>
                Approve Time
                <CheckIcon ml={{ base: 1, md: 3 }} boxSize={3} />
              </Button>
            </Flex>
          </Flex>
        );
      case SCHEDULED:
        return (
          <Flex direction="column" gap={3} textAlign="left">
            <Flex gap={3} align="center">
              <Text>Pickup Day Confirmed</Text>
              <CheckCircleIcon color="green.200" />
            </Flex>
            <Text fontWeight="700">
              {formatDate(new Date(standardizeDate(donation.pickupDate)))}
            </Text>
            <Text>
              Be sure to leave all items outside your door before&nbsp;
              <Text as="span" fontWeight="700">
                3:30PM
              </Text>
            </Text>
            <Flex gap={3} visibility="hidden">
              <Button colorScheme="red">
                Reject Time
                <CloseIcon ml={3} />
              </Button>
              <Button colorScheme="green">
                Approve Time
                <CheckIcon ml={3} />
              </Button>
            </Flex>
          </Flex>
        );
      case CHANGES_REQUESTED:
        return (
          <Flex flexDir="column" textAlign="left">
            <Box>
              After submitting your changes, we&apos;ll be scheduling a pickup date with you soon.
            </Box>
          </Flex>
        );
      case PICKED_UP:
        return (
          <Flex h="100%" direction="column" justify="center" gap={2} p="2em">
            <Flex flexDir="column" alignItems="center">
              <Box bg="green.100" borderRadius="10rem" p="1.5rem" mb=".5rem">
                <IconContext.Provider value={{ color: '#38A169', size: '5.5rem' }}>
                  <FaTruckPickup />
                </IconContext.Provider>
              </Box>
              <Text textAlign="center" fontSize={{ base: '18px', md: '20px' }}>
                Your items have been successfully picked up!
              </Text>
            </Flex>
          </Flex>
        );
      default:
        return (
          <Flex h="100%" direction="column" justify="center" gap={2} p="2em">
            <Flex flexDir="column" alignItems="center">
              <Box bg="blue.100" borderRadius="10rem" p="1.5rem" mb=".5rem">
                <IconContext.Provider value={{ color: '#3182CE', size: '5.5rem' }}>
                  <FaTruckPickup />
                </IconContext.Provider>
              </Box>
              <Text textAlign="center" fontSize={{ base: '18px', md: '20px' }}>
                Your pickup is being rescheduled. Patriots and Paws will scheduling a new pickup
                date shortly.
              </Text>
            </Flex>
          </Flex>
        );
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
    <Flex h="100vh" direction="column">
      <Flex bg="gray.200" p={7} direction="column" gap={7} flexGrow={1} justify="space-between">
        <Grid
          templateAreas={{
            md: `"donationHeader pickupHeader"
                  "banner pickup"
                  "details pickup"`,
          }}
          gridTemplateRows="auto auto 1fr"
          gridTemplateColumns={{ base: 'minmax(0, 1fr)', md: '3fr 1fr' }}
          align="center"
          gap={5}
          h="100%"
        >
          <GridItem area={{ md: 'donationHeader' }} align="center">
            <Flex align="center" gap={2}>
              <Text fontSize="1.75em" fontWeight="700">
                My Donation
              </Text>
              <Box display={{ base: 'inline', md: 'none' }}>
                {displayStatusTag(donation.status)}
              </Box>
            </Flex>
          </GridItem>
          <GridItem area={{ md: 'banner' }} textAlign="left">
            {displayBanner()}
          </GridItem>
          <GridItem
            area={{ md: 'details' }}
            borderRadius="6px"
            bg="white"
            w="100%"
            h="100%"
            overflowY="auto"
            p={6}
          >
            <DonationDetails data={donation} setDonationData={setDonation} />
          </GridItem>
          <GridItem gap={3} area={{ md: 'pickupHeader' }}>
            <Flex direction="row" gap={3} align="center">
              <Text fontSize="1.75em" fontWeight="700">
                Pickup
              </Text>
              <Box p={2}>
                {donation.status === SCHEDULING && (
                  <Tag bg="blue.300" color="white">
                    NEW
                  </Tag>
                )}
              </Box>
            </Flex>
          </GridItem>
          <GridItem area={{ md: 'pickup' }}>
            <Box
              borderRadius="6px"
              bg="white"
              h="100%"
              py={4}
              px={6}
              minHeight="150px"
              textAlign="left"
            >
              {displayPickup()}
            </Box>
          </GridItem>
        </Grid>
        <Flex direction="column">
          <Text fontSize="1.75em" fontWeight="700" mb={{ base: '10px', md: '20px' }}>
            Track your donation
          </Text>
          {donation?.status && <TrackDonationSection status={donation.status} />}
        </Flex>
      </Flex>
      <DonorFooter />
    </Flex>
  );
};

DonorDashboard.propTypes = {
  donationId: PropTypes.string.isRequired,
};

export default DonorDashboard;

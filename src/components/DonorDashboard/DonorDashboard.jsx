import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Box, Text, Button, Tag, Link, Flex } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { getDonationData } from '../../utils/DonorUtils';
import DonorFooter from '../DonorFooter/DonorFooter';
import TrackDonationSection from '../TrackDonationSection/TrackDonationSection';
import DonationDetails from './DonationDetails';
import { STATUSES } from '../../utils/config';

const {
  PENDING,
  SCHEDULING,
  SCHEDULED,
  CHANGES_REQUESTED,
  PICKED_UP,
  // APPROVAL_REQUESTED,
  // RESCHEDULE,
} = STATUSES;

const DonorDashboard = ({ donationId }) => {
  const [stage, setStage] = useState(0);
  const [donation, setDonation] = useState({});

  const displayNewTag = () => {
    if (donation.status === SCHEDULING) {
      return (
        <Tag bg="blue.200" color="white">
          New
        </Tag>
      );
    }
    return <></>;
  };

  const displayBanner = () => {
    const { status } = donation;
    if (donation) {
      if (status === PENDING) {
        return (
          <Flex borderRadius="6px" bg="blue.50" w="100%" p={4} mb={4}>
            <CheckCircleIcon color="blue.100" mr={2} boxSize={5} />
            <Box>
              Your donation has been successfully submitted and will be reviewed shortly! Be sure to
              check your inbox for updates and email us at{' '}
              <Link href="mailto:pnp@gmail.com" color="blue.500" textDecoration="underline">
                pnp@gmail.com
              </Link>{' '}
              with any changes.
            </Box>
          </Flex>
        );
      }
      if (status === SCHEDULING) {
        return (
          <Flex borderRadius="6px" bg="green.50" w="100%" p={4} mb={4} color="black">
            <CheckCircleIcon color="green.500" mr={2} boxSize={5} />
            <Box>Your donation has been approved! Be sure to schedule your pick up time.</Box>
          </Flex>
        );
      }
      if (status === CHANGES_REQUESTED) {
        return (
          <Box borderRadius="6px" bg="orange.100" w="100%" p={4} mb={4} color="black">
            <WarningIcon color="orange.500" mr={2} boxSize={5} />
            <Box>
              Your donation requires adjustments. Check your email to see what changes are needed
              and edit your form accordingly.
            </Box>
          </Box>
        );
      }
    }
    return (
      <Box borderRadius="6px" bg="gray.50" w="100%" p={4} mb={4} color="black">
        Invalid status
      </Box>
    );
  };

  const displayPickup = () => {
    if (donation.status === PENDING) {
      return <Box>Sit Tight! We&apos;ll be scheduling a pickup date with you soon.</Box>;
    }

    if (donation.status === SCHEDULING) {
      return (
        <Grid templateColumns="repeat(3, 1fr)" padding={3}>
          <GridItem colSpan={3}>
            <Text>Proposed Date:</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <Text as="b">February 30th 6969</Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Button bg="red.500" color="white" mr={3} mt={3}>
              Reject Time
              <CloseIcon ml={3} boxSize={2} />
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button bg="green" color="white" mr={3} mt={3}>
              Approve Time
              <CheckIcon ml={3} boxSize={2} />
            </Button>
          </GridItem>
        </Grid>
      );
    }

    if (donation.status === CHANGES_REQUESTED) {
      return (
        <Box>
          After submitting your changes, we&apos;ll be scheduling a pickup date with you soon.
        </Box>
      );
    }
    return <Box>No pickup</Box>;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDonationData(donationId);
      const donationStatus = data.status;
      const donationStage = {
        [PICKED_UP]: 4,
        [SCHEDULED]: 3,
        [SCHEDULING]: 2,
        [PENDING]: 1,
        [CHANGES_REQUESTED]: 1,
      };
      setStage(donationStage[donationStatus] ?? 1);
      setDonation(data);
    };
    fetchData();
  }, [donationId]);

  return (
    <>
      <Flex bg="gray.200" p={10} direction="column" gap={10}>
        <Grid gap={10} templateColumns="4fr 1fr">
          <Flex direction="column" gap={3}>
            <Text fontSize="30px" fontWeight="700">
              My Donation
            </Text>
            {displayBanner()}
            <Box borderRadius="6px" bg="white" w="100%" h="500" p={4}>
              <DonationDetails data={donation} setDonationData={setDonation} />
            </Box>
          </Flex>
          <Flex direction="column" gap={3}>
            <Text fontSize="30px" fontWeight="700">
              Pick Up
            </Text>
            {displayNewTag()}
            <Box borderRadius="6px" bg="white" w="100%" h="100%" p={4}>
              {displayPickup()}
            </Box>
          </Flex>
        </Grid>
        <flex>
          <Text fontSize="30px" fontWeight="700" mb="20px">
            Track your donation
          </Text>
          <TrackDonationSection stage={stage} />
        </flex>
      </Flex>
      {/* BUG: If window too small height, overflow occurs & screen becomes scrollable */}
      <DonorFooter />
    </>
  );
};

DonorDashboard.propTypes = {
  donationId: PropTypes.string.isRequired,
};

export default DonorDashboard;

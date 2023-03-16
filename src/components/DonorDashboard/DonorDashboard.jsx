import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Box, Text, Button, Tag, HStack } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { getDonationStatus, getDonation } from '../../utils/donorUtils';
import DonorFooter from '../DonorFooter/DonorFooter';
import TrackDonationSection from '../TrackDonationSection/TrackDonationSection';
import DonationDetails from './DonationDetails';

const DonorDashboard = ({ donationId }) => {
  const [stage, setStage] = useState(0);
  const [donation, setDonation] = useState();

  // eslint-disable-next-line consistent-return
  const displayNewTag = () => {
    if (donation) {
      if (donation.status === 'scheduling') {
        return (
          <Tag bg="blue.200" color="white">
            New
          </Tag>
        );
      }
    }
  };

  const displayBanner = () => {
    // pending
    if (donation) {
      if (donation.status === 'pending') {
        return (
          <Box borderRadius="6px" bg="blue.50" w="100%" p={4} mb={4} color="black">
            <CheckCircleIcon color="blue.100" mr={2} boxSize={5} />
            Your donation has been successfully submitted and will be reviewed shortly! Be sure to
            check your inbox for updates and email us at pnp@gmail.com with any changes.
          </Box>
        );
      }
      // approved
      if (donation.status === 'scheduling') {
        return (
          <Box borderRadius="6px" bg="green.50" w="100%" p={4} mb={4} color="black">
            <CheckCircleIcon color="green.500" mr={2} boxSize={5} />
            Your donation has been approved! Be sure to schedule your pick up time.
          </Box>
        );
      }
      // flagged
      if (donation.status === 'changes requested') {
        return (
          <Box borderRadius="6px" bg="orange.100" w="100%" p={4} mb={4} color="black">
            <WarningIcon color="orange.500" mr={2} boxSize={5} />
            Your donation requires adjustments. Check your email to see what changes are needed and
            edit your form accordingly.
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
    if (donation) {
      // pending
      if (donation.status === 'pending') {
        return <Box>Sit Tight! We&apos;ll be scheduling a pickup date with you soon.</Box>;
      }

      // approved
      if (donation.status === 'scheduling') {
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

      // flagged
      if (donation.status === 'changes requested') {
        return (
          <Box>
            After submitting your changes, we&apos;ll be scheduling a pickup date with you soon.{' '}
          </Box>
        );
      }
    }
    return <Box>No pickup</Box>;
  };

  useEffect(() => {
    const fetchData = async () => {
      const donationStatus = await getDonationStatus(donationId);
      // const donation = await getDonation(donationId);
      getDonation(donationId).then(res => {
        if (res != null) {
          setDonation(res);
          // console.log(res);
        }
      });
      // console.log(getDonation(donationId));
      const donationStage = {
        archieved: 4,
        scheduled: 3,
        approved: 2,
        scheduling: 2,
        pending: 1,
        'changes requested': 1,
      };
      setStage(donationStage[donationStatus] ?? 1);
    };
    fetchData();
  }, [donationId]);

  return (
    <Box bg="#edf1f9" maxH="100%">
      <Grid templateColumns="repeat(3, 1fr)" gap={10} p="20px 40px 40px 40px">
        <GridItem colSpan={2}>
          <Text fontSize="30px" fontWeight="700" mb="20px">
            My Donation
          </Text>
          {displayBanner()}
          <Box borderRadius="6px" bg="white" w="100%" h="500" p={4}>
            <DonationDetails data={donation} />
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <HStack mb="20px">
            <Text fontSize="30px" fontWeight="700" mr="10px">
              Pick Up
            </Text>
            {displayNewTag()}
          </HStack>
          <Box borderRadius="6px" bg="white" w="100%" h="500" p={4}>
            {displayPickup()}
          </Box>
        </GridItem>
        <GridItem colSpan={3}>
          <Text fontSize="30px" fontWeight="700" mb="20px">
            Track your donation
          </Text>
          <TrackDonationSection stage={stage} />
        </GridItem>
      </Grid>

      {/* BUG: If window too small height, overflow occurs & screen becomes scrollable */}
      <DonorFooter />
    </Box>
  );
};

DonorDashboard.propTypes = {
  donationId: PropTypes.string.isRequired,
};

export default DonorDashboard;

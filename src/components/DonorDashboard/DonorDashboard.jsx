import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Box, Text } from '@chakra-ui/react';
import { getDonationStatus } from '../../utils/donorUtils';
import DonorFooter from '../DonorFooter/DonorFooter';
import TrackDonationSection from '../TrackDonationSection/TrackDonationSection';

const DonorDashboard = ({ donationId }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const donationStatus = await getDonationStatus(donationId);
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
    <Box bg="#edf1f9" minHeight="100vh">
      <Grid templateColumns="repeat(3, 1fr)" gap={10} p="20px 40px 40px 40px">
        <GridItem colSpan={2}>
          <Text fontSize="30px" fontWeight="700" mb="20px">
            My Forms
          </Text>
          <Box bg="white" w="100%" h="500" p={4} />
        </GridItem>
        <GridItem colSpan={1}>
          <Text fontSize="30px" fontWeight="700" mb="20px">
            Pick Up
          </Text>
          <Box bg="white" w="100%" h="500" p={4} />
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

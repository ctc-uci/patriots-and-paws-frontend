import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Box, Text, Link } from '@chakra-ui/react';
import { getDonationStatus } from '../../utils/donorUtils';
import TrackDonationCard from './TrackDonationCard';

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
      setStage(donationStage[donationStatus]);
    };
    fetchData();
  }, [donationId]);

  return (
    <Box bg="#edf1f9">
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
          <TrackDonationCard stage={stage} />
        </GridItem>
      </Grid>

      <footer
        style={{
          backgroundColor: 'white',
          borderWidth: '4px 0px 0px 0px',
          borderColor: '#3182CE #fff #fff #fff',
        }}
      >
        <Grid
          templateColumns="repeat(12, 1fr)"
          p="20px 40px 20px 40px"
          fontSize="15px"
          fontWeight="500"
          textAlign="center"
        >
          <GridItem colSpan={1}>
            <Link href="https://www.patriotsandpaws.org/our-story/">About Us</Link>
          </GridItem>
          <GridItem colSpan={1}>
            <Link href="https://www.patriotsandpaws.org/wanted/">Volunteer</Link>
          </GridItem>
          <GridItem colSpan={1}>
            <Link href="https://www.patriotsandpaws.org/asked-questions/">FAQ</Link>
          </GridItem>
          <GridItem colSpan={2}>
            <Link href="https://www.patriotsandpaws.org/donors">Donors & Supporters</Link>
          </GridItem>
          <GridItem colSpan={2} textAlign="center">
            <Link href="https://www.patriotsandpaws.org/" color="red.500" fontSize="20px">
              Patriots & Paws
            </Link>
          </GridItem>
        </Grid>
      </footer>
    </Box>
  );
};

DonorDashboard.propTypes = {
  donationId: PropTypes.string.isRequired,
};

export default DonorDashboard;

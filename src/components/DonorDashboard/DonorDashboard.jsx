import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Box, Text, IconButton, useDisclosure } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { getDonationData } from '../../utils/donorUtils';
import DonorFooter from '../DonorFooter/DonorFooter';
import TrackDonationSection from '../TrackDonationSection/TrackDonationSection';
import EditDonationModal from '../EditDonationModal/EditDonationModal';

const DonorDashboard = ({ donationId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stage, setStage] = useState(0);
  const [donationData, setDonationData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDonationData(donationId);
      const donationStatus = data.status;
      const donationStage = {
        archieved: 4,
        scheduled: 3,
        approved: 2,
        scheduling: 2,
        pending: 1,
        'changes requested': 1,
      };
      setStage(donationStage[donationStatus] ?? 1);
      setDonationData(data);
    };
    fetchData();
  }, [donationId]);

  return (
    <>
      <Box bg="#edf1f9" minHeight="100vh">
        <Grid templateColumns="repeat(3, 1fr)" gap={10} p="20px 40px 40px 40px">
          <GridItem colSpan={2}>
            <Text fontSize="30px" fontWeight="700" mb="20px">
              My Forms
            </Text>
            <Box bg="white" w="100%" h="500" p={4}>
              <IconButton icon={<EditIcon />} float="right" onClick={onOpen} />
            </Box>
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
      <EditDonationModal donationData={donationData} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

DonorDashboard.propTypes = {
  donationId: PropTypes.string.isRequired,
};

export default DonorDashboard;

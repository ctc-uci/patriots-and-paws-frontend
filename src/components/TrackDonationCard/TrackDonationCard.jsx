import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@chakra-ui/react';
import { getDonationStatus } from '../../utils/donorUtils';
import styles from './TrackDonationCard.module.css';

const TrackDonationCard = ({ donationId }) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setStatus(await getDonationStatus(donationId));
    };
    fetchData();
  }, [donationId]);
  return (
    <>
      <h1>donation card</h1>
      <p>
        {donationId} {status}
      </p>

      <Grid templateColumns="repeat(4, 1fr)" gap={1}>
        <GridItem w="100%" h="100" className={styles.statusBox}>
          <h2>Form Submitted</h2>
        </GridItem>
        <GridItem w="100%" h="100" bg="green.500">
          <h2>Submission Approved</h2>
        </GridItem>
        <GridItem w="100%" h="100" bg="blue.500">
          <h2>Pickup Schedule</h2>
        </GridItem>
        <GridItem w="100%" h="100" bg="blue.500">
          <h2>Donation Picked Up</h2>
        </GridItem>
      </Grid>
    </>
  );
};

TrackDonationCard.propTypes = {
  donationId: PropTypes.number.isRequired,
};

export default TrackDonationCard;

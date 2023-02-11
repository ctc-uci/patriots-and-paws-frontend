import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Box } from '@chakra-ui/react';
import TrackDonationCard from './TrackDonationCard';
import styles from './DonorDashboard.module.css';

const DonorDashboard = ({ donationId }) => {
  return (
    <div className={styles.background}>
      <Grid templateColumns="repeat(3, 1fr)" gap={10} className={styles.content}>
        <GridItem colSpan={2}>
          <h1 className={styles.title}>My Forms</h1>
          <Box bg="white" w="100%" h="500" p={4} />
        </GridItem>
        <GridItem colSpan={1}>
          <h1 className={styles.title}>Pick Up</h1>
          <Box bg="white" w="100%" h="500" p={4} />
        </GridItem>
        <GridItem colSpan={3}>
          <h1 className={styles.title}>Track your donation</h1>
          <TrackDonationCard donationId={donationId} />
        </GridItem>
      </Grid>
      <footer>
        <Grid templateColumns="repeat(9, 1fr)" className={styles.footerContent}>
          <GridItem colSpan={4} className={styles.links}>
            <a href="https://www.patriotsandpaws.org/our-story/">About Us</a>
            <a href="https://www.patriotsandpaws.org/wanted/">Volunteer</a>
            <a href="https://www.patriotsandpaws.org/asked-questions/">FAQ</a>
            <a href="https://www.patriotsandpaws.org/donors">Donors & Supporters</a>
          </GridItem>
          <GridItem colSpan={1}>
            <a href="https://www.patriotsandpaws.org/" className={styles.pnp}>
              Patriots & Paws
            </a>
          </GridItem>
        </Grid>
      </footer>
    </div>
  );
};

DonorDashboard.propTypes = {
  donationId: PropTypes.string.isRequired,
};

export default DonorDashboard;

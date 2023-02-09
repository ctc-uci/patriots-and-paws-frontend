import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@chakra-ui/react';
import { getDonationStatus } from '../../utils/donorUtils';
import styles from './TrackDonationCard.module.css';
import checkMark from './checkMark.png';
import circle from './circle.png';

const TrackDonationCard = ({ donationId }) => {
  // const [status, setStatus] = useState('');
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const donationStatus = await getDonationStatus(donationId);
      // setStatus(donationStatus);

      if (donationStatus === 'archieved') {
        setStage(4);
      } else if (donationStatus === 'scheduled') {
        setStage(3);
      } else if (donationStatus === 'approved' || donationStatus === 'scheduling') {
        setStage(2);
      } else {
        setStage(1);
      }
    };
    fetchData();
  }, [donationId]);
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={0}>
        <GridItem w="100%" className={stage === 1 ? styles.currStatus : styles.statusBox}>
          <div className={styles.container}>
            <img src={stage >= 1 ? checkMark : circle} alt="check mark" />
            <div>
              <h2 className={styles.title}>Form Submitted</h2>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              </p>
            </div>
          </div>
        </GridItem>

        <GridItem w="100%" className={stage === 2 ? styles.currStatus : styles.statusBox}>
          <div className={styles.container}>
            <img src={stage >= 2 ? checkMark : circle} alt="check mark" />
            <div>
              <h2 className={styles.title}>Submission Approved</h2>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              </p>
            </div>
          </div>
        </GridItem>

        <GridItem w="100%" className={stage === 3 ? styles.currStatus : styles.statusBox}>
          <div className={styles.container}>
            <img src={stage >= 3 ? checkMark : circle} alt="check mark" />
            <div>
              <h2 className={styles.title}>Pickup Scheduled</h2>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              </p>
            </div>
          </div>
        </GridItem>

        <GridItem w="100%" className={stage === 4 ? styles.currStatus : styles.statusBox}>
          <div className={styles.container}>
            <img src={stage >= 4 ? checkMark : circle} alt="check mark" />
            <div>
              <h2 className={styles.title}>Donation Picked Up</h2>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              </p>
            </div>
          </div>
        </GridItem>
      </Grid>
    </>
  );
};

TrackDonationCard.propTypes = {
  donationId: PropTypes.string.isRequired,
};

export default TrackDonationCard;

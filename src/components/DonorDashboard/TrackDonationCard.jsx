import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@chakra-ui/react';
import styles from './TrackDonationCard.module.css';
import checkMark from './checkMark.png';
import circle from './circle.png';

const TrackDonationCard = ({ stage }) => {
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={0}>
        <GridItem
          w="100%"
          className={stage === 1 ? styles.currStatus : styles.statusBox}
          bg="white"
        >
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

        <GridItem
          w="100%"
          className={stage === 2 ? styles.currStatus : styles.statusBox}
          bg="white"
        >
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

        <GridItem
          w="100%"
          className={stage === 3 ? styles.currStatus : styles.statusBox}
          bg="white"
        >
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

        <GridItem
          w="100%"
          className={stage === 4 ? styles.currStatus : styles.statusBox}
          bg="white"
        >
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
  stage: PropTypes.number.isRequired,
};

export default TrackDonationCard;

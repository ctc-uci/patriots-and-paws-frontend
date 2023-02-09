import React from 'react';
import PropTypes from 'prop-types';
import TrackDonationCard from './TrackDonationCard';
import styles from './DonorDashboard.module.css';

const DonorDashboard = ({ donationId }) => {
  return (
    <>
      <div className={styles.track}>
        <h1 className={styles.title}>Track your donation</h1>
        <TrackDonationCard donationId={donationId} />
      </div>
    </>
  );
};

DonorDashboard.propTypes = {
  donationId: PropTypes.string.isRequired,
};

export default DonorDashboard;

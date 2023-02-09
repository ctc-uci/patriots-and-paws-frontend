import React from 'react';
import PropTypes from 'prop-types';
import TrackDonationCard from '../TrackDonationCard/TrackDonationCard';

const DonorDashboard = ({ donationId }) => {
  return (
    <>
      <p>donor dashboard</p>
      <TrackDonationCard donationId={donationId} />
    </>
  );
};

DonorDashboard.propTypes = {
  donationId: PropTypes.number.isRequired,
};

export default DonorDashboard;

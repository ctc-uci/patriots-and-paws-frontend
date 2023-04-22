import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@chakra-ui/react';
import TrackDonationCard from './TrackDonationCard';
import { STATUSES } from '../../utils/config';

const { PENDING, SCHEDULING, SCHEDULED, CHANGES_REQUESTED, PICKED_UP } = STATUSES;

const donationStage = {
  [PICKED_UP]: 4,
  [SCHEDULED]: 3,
  [SCHEDULING]: 2,
  [PENDING]: 1,
  [CHANGES_REQUESTED]: 1,
};

const TrackDonationSection = ({ status }) => {
  const stage = donationStage[status] ?? 1;
  const descriptions = [
    {
      checked: stage >= 1,
      curr: stage === 1,
      heading: 'Form Submitted',
      body: 'Thanks for your donation! Keep an on your inbox for updates.',
    },
    {
      checked: stage >= 2,
      curr: stage === 2,
      heading: 'Submission Approved',
      body: 'Make sure to schedule a time for us to pick up your donation.',
    },
    {
      checked: stage >= 3,
      curr: stage === 3,
      heading: 'Pickup Scheduled',
      body: 'We’ll swing by and pick up your items shortly.',
    },
    {
      checked: stage >= 4,
      curr: stage === 4,
      heading: 'Donation Picked Up',
      body: 'We’re received your donation - Thanks for your contribution!',
    },
  ];

  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={0} display={{ md: 'flex' }}>
        {descriptions.map(e => (
          <GridItem key={e.heading}>
            <TrackDonationCard {...e} />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

TrackDonationSection.propTypes = {
  status: PropTypes.string.isRequired,
};

export default TrackDonationSection;

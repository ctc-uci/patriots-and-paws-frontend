import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@chakra-ui/react';
import TrackDonationCard from './TrackDonationCard';

const TrackDonationSection = ({ stage }) => {
  const descriptions = [
    {
      checked: stage >= 1,
      curr: stage === 1,
      heading: 'Form Submitted',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
    },
    {
      checked: stage >= 2,
      curr: stage === 2,
      heading: 'Submission Approved',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
    },
    {
      checked: stage >= 3,
      curr: stage === 3,
      heading: 'Pickup Scheduled',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
    },
    {
      checked: stage >= 4,
      curr: stage === 4,
      heading: 'Donation Picked Up',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
    },
  ];

  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={0}>
        <GridItem>
          <TrackDonationCard description={descriptions[0]} />
        </GridItem>
        <GridItem>
          <TrackDonationCard description={descriptions[1]} />
        </GridItem>
        <GridItem>
          <TrackDonationCard description={descriptions[2]} />
        </GridItem>
        <GridItem>
          <TrackDonationCard description={descriptions[3]} />
        </GridItem>
      </Grid>
    </>
  );
};

TrackDonationSection.propTypes = {
  stage: PropTypes.number.isRequired,
};

export default TrackDonationSection;

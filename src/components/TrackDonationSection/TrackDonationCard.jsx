import React from 'react';
import PropTypes from 'prop-types';
import { Card, Stack, Heading, Text, Icon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { BiRadioCircle } from 'react-icons/bi';

import styles from './TrackDonationCard.module.css';

const TrackDonationCard = ({ checked, curr, heading, body }) => {
  return (
    <Card
      h="100%"
      borderRadius={0}
      className={curr || checked ? styles.currStatus : styles.statusBox}
      direction="row"
      p="1em"
      gap="1em"
    >
      {checked ? (
        <CheckCircleIcon color="#63B3ED" boxSize="2rem" />
      ) : (
        <Icon as={BiRadioCircle} color="#63B3ED" boxSize="2rem" />
      )}
      <Stack gap={0}>
        <Heading size="md" whiteSpace="nowrap">
          {heading}
        </Heading>
        <Text fontSize="1em">{body}</Text>
      </Stack>
    </Card>
  );
};

TrackDonationCard.propTypes = {
  checked: PropTypes.bool.isRequired,
  curr: PropTypes.bool.isRequired,
  heading: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default TrackDonationCard;

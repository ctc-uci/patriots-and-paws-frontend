import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, Heading, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { BiRadioCircle } from 'react-icons/bi';
import { IconContext } from 'react-icons';

import styles from './TrackDonationCard.module.css';

const TrackDonationCard = ({ checked, curr, heading, body }) => {
  return (
    <Card
      h="100%"
      borderRadius={0}
      className={curr || checked ? styles.currStatus : styles.statusBox}
    >
      <CardHeader display="flex" alignItems="center">
        {checked && <CheckCircleIcon color="#63B3ED" boxSize="2.3rem" mr="1rem" />}
        {
          !checked && (
            <IconContext.Provider value={{ color: '#63B3ED', size: '4rem' }}>
              <BiRadioCircle />
            </IconContext.Provider>
          ) // display circle
        }
        <Heading size="sm">{heading}</Heading>
      </CardHeader>
      <CardBody mt="-20px">
        <Text fontSize="1em">{body}</Text>
      </CardBody>
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

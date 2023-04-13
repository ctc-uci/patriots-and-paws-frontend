import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, Heading, Text, Image } from '@chakra-ui/react';
import styles from './TrackDonationCard.module.css';
import checkMark from './checkMark.png';
import circle from './circle.png';

const TrackDonationCard = ({ checked, curr, heading, body }) => {
  return (
    <Card h="100%" className={curr ? styles.currStatus : styles.statusBox}>
      <CardHeader display="flex" alignItems="center">
        <Image
          src={checked ? checkMark : circle}
          alt="check mark"
          marginRight="20px"
          size=".75em"
        />
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

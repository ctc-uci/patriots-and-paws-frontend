import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, Heading, Text, Image } from '@chakra-ui/react';
import styles from './TrackDonationCard.module.css';
import checkMark from './checkMark.png';
import circle from './circle.png';

const TrackDonationCard = ({ description }) => {
  return (
    <Card h="100%" className={description.curr ? styles.currStatus : styles.statusBox}>
      <CardHeader display="flex" alignItems="center">
        <Image src={description.checked ? checkMark : circle} alt="check mark" marginRight="20px" />
        <Heading size="md">{description.heading}</Heading>
      </CardHeader>
      <CardBody mt="-20px">
        <Text fontSize="15px">{description.body}</Text>
      </CardBody>
    </Card>
  );
};

TrackDonationCard.propTypes = {
  description: PropTypes.shape({
    checked: PropTypes.bool.isRequired,
    curr: PropTypes.bool.isRequired,
    heading: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default TrackDonationCard;

import React from 'react';
import {
  Flex,
  Box,
  Text,
  Checkbox,
  Card,
  CardBody,
  Heading,
  IconButton,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { PropTypes } from 'prop-types';

import { PNPBackend } from '../../utils/utils';
import { STATUSES } from '../../utils/config';

const { PICKED_UP, SCHEDULED } = STATUSES;

const DonationCard = ({ data, itemsCount, handleRowClick, setDonations }) => {
  const { id, status } = data;
  const detailsButton = useBreakpointValue({
    base: (
      <IconButton
        variant="ghost"
        icon={<InfoIcon />}
        aria-label="View Details"
        onClick={() => handleRowClick(data)}
      />
    ),
    md: (
      <Button variant="outline" fontSize="sm" onClick={() => handleRowClick(data)}>
        View Details
      </Button>
    ),
  });

  const pickupComplete = async donationId => {
    await PNPBackend.put(`/donations/${donationId}`, {
      status: PICKED_UP,
    });
    setDonations(prev => prev.map(ele => (ele.id === id ? { ...ele, status: PICKED_UP } : ele)));
  };

  const pickupIncomplete = async donationId => {
    await PNPBackend.put(`/donations/${donationId}`, {
      status: SCHEDULED,
    });
    setDonations(prev => prev.map(ele => (ele.id === id ? { ...ele, status: SCHEDULED } : ele)));
  };

  return (
    <Card>
      <CardBody>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex gap={5} alignItems="center">
            {status === PICKED_UP ? (
              <Checkbox
                defaultChecked
                onChange={() => {
                  pickupIncomplete(id);
                }}
              />
            ) : (
              <Checkbox
                onChange={() => {
                  pickupComplete(id);
                }}
              />
            )}
            {status === PICKED_UP ? (
              <Box>
                <Heading size="sm" color="#858585">
                  Donation #{id}
                </Heading>
                <Text color="#858585">{itemsCount} items</Text>
              </Box>
            ) : (
              <Box>
                <Heading size="sm">Donation #{id}</Heading>
                <Text>{itemsCount} items</Text>
              </Box>
            )}
          </Flex>
          {detailsButton}
        </Flex>
      </CardBody>
    </Card>
  );
};

DonationCard.propTypes = {
  data: PropTypes.string,
  itemsCount: PropTypes.number,
  handleRowClick: PropTypes.func.isRequired,
  setDonations: PropTypes.func.isRequired,
};

DonationCard.defaultProps = {
  data: {},
  itemsCount: 0,
};

export default DonationCard;

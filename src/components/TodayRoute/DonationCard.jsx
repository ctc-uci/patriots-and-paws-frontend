import React from 'react';
import { Flex, Box, Text, Button, Checkbox, Card, CardBody, Heading } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';

import { PNPBackend } from '../../utils/utils';
import { STATUSES } from '../../utils/config';

const { PICKED_UP, SCHEDULED } = STATUSES;

const DonationCard = ({ data, itemsCount, handleRowClick }) => {
  const { id, status } = data;
  const pickupComplete = donationId => {
    PNPBackend.put(`/donations/${donationId}`, {
      status: PICKED_UP,
    });
  };

  const pickupIncomplete = donationId => {
    PNPBackend.put(`/donations/${donationId}`, {
      status: SCHEDULED,
    });
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
                  pickupIncomplete(data.id);
                }}
              />
            ) : (
              <Checkbox
                onChange={() => {
                  pickupComplete(data.id);
                }}
              />
            )}
            <Box>
              <Heading size="sm">Donation #{id}</Heading>
              <Text>{itemsCount} items</Text>
            </Box>
          </Flex>
          <Button variant="outline" fontSize="sm" onClick={() => handleRowClick(data)}>
            View Details
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

DonationCard.propTypes = {
  data: PropTypes.string,
  itemsCount: PropTypes.number,
  handleRowClick: PropTypes.func.isRequired,
};

DonationCard.defaultProps = {
  data: {},
  itemsCount: 0,
};

export default DonationCard;

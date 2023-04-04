import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stat,
  Heading,
  Flex,
  CloseButton,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function DonationCard({ donatedFurniture, changeDon, removeDon }) {
  const { name, count } = donatedFurniture;
  const [value, setValue] = useState(count);

  const handleChange = val => {
    setValue(val);
    changeDon(name, val);
  };

  useEffect(() => {
    handleChange(count);
  }, [count]);

  return (
    <Stat
      width="80%"
      margin="5px 0 5px 0"
      border="1px"
      borderRadius="10px"
      borderColor="gray.200"
      padding="5px"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Heading marginLeft="5px" size="sm">
          {name}
        </Heading>
        <Flex flexDirection="row" alignItems="center" gap="10px">
          <NumberInput value={value} onChange={handleChange} min={1} max={100} size="sm">
            <NumberInputField w="5em" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <CloseButton
            onClick={() => removeDon(name)}
            size="sm"
            color="red.500"
            margin="0 5px 0 5px"
          />
        </Flex>
      </Flex>
    </Stat>
  );
}
DonationCard.propTypes = {
  donatedFurniture: PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  changeDon: PropTypes.func.isRequired,
  removeDon: PropTypes.func.isRequired,
};

export default DonationCard;

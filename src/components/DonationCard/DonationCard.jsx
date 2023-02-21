import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stat,
  Heading,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './DonationCard.module.css';

function DonationCard({ donatedFurniture, changeDon, removeDon }) {
  const { name, num } = donatedFurniture;
  const [value, setValue] = useState(num);

  const handleChange = val => {
    setValue(val);
    changeDon(name, val);
  };

  useEffect(() => {
    handleChange(num);
  }, [num]);

  return (
    <Stat className={styles['field-section']}>
      <Flex border="1px" borderColor="gray.200" alignItems="center" h={50} w={300} paddingLeft={5}>
        <Heading size="sm">{name}</Heading>
        <Spacer />
        <NumberInput
          value={value}
          onChange={handleChange}
          min={1}
          className={styles['integer-input']}
          size="sm"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <CloseIcon onClick={() => removeDon(name)} w={7} h={7} color="red.500" padding={2} />
      </Flex>
    </Stat>
  );
}
DonationCard.propTypes = {
  donatedFurniture: PropTypes.shape({
    name: PropTypes.string.isRequired,
    num: PropTypes.number.isRequired,
  }).isRequired,
  changeDon: PropTypes.func.isRequired,
  removeDon: PropTypes.func.isRequired,
};

export default DonationCard;

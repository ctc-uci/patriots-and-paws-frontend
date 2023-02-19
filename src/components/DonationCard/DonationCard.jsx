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
import React from 'react';
import PropTypes from 'prop-types';
import styles from './DonationCard.module.css';

function DonationCard({ donation, changeDon, removeDon }) {
  // console.log(name, num);
  const { name, num } = donation;
  return (
    <Stat className={styles['field-section']}>
      <Flex
        border="1px"
        borderColor="gray.200"
        alignItems="center"
        h="14vh"
        w="30vw"
        paddingLeft={5}
      >
        <Heading size="sm">{name}</Heading>
        <Spacer />
        <NumberInput
          defaultValue={num}
          onChange={ev => changeDon(name, ev)}
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
        <CloseIcon onClick={() => removeDon(name)} w="3vw" h="3vh" color="red.500" />
      </Flex>
    </Stat>
  );
}
DonationCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  donation: PropTypes.object.isRequired,
  changeDon: PropTypes.func.isRequired,
  removeDon: PropTypes.func.isRequired,
};

export default DonationCard;

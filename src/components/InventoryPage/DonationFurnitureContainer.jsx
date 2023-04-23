import React, { useEffect, useState } from 'react';
import { InputGroup, Input, InputRightAddon, Flex } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import styles from './DonationFurnitureContainer.module.css';

const DonationFurnitureContainer = ({ data }) => {
  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    setDisplayedData(data);
  }, [data]);

  return (
    <>
      <Flex direction="column" gap={0} overflowY="scroll">
        {displayedData?.map(furniture => (
          <InputGroup key={furniture.id}>
            <Input value={furniture.name} isReadOnly color="#2d3748" />
            <InputRightAddon
              w="4em"
              variation="outline"
              className={styles['furniture-input-addon']}
            >
              {furniture.count}
            </InputRightAddon>
          </InputGroup>
        ))}
      </Flex>
    </>
  );
};

DonationFurnitureContainer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      count: PropTypes.number,
    }),
  ),
};

DonationFurnitureContainer.defaultProps = {
  data: [],
};

export default DonationFurnitureContainer;

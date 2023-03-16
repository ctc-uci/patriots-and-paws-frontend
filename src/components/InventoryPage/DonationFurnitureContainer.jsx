import React, { useEffect, useState } from 'react';
import { InputGroup, Input, InputRightAddon, Flex } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import './DonationFurnitureContainer.module.css';

const DonationFurnitureContainer = ({ data }) => {
  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    setDisplayedData(data);
  }, []);

  return (
    <>
      <Flex direction="column" gap={3} height="100px" overflowY="scroll">
        {displayedData?.map(furniture => (
          <InputGroup key={furniture.id}>
            <Input value={furniture.name} isDisabled />
            <InputRightAddon w="4em">{furniture.count}</InputRightAddon>
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

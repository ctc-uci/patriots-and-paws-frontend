import React, { useEffect, useState } from 'react';
import { InputGroup, Input, InputRightAddon, Flex } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';

const DonationFurnitureContainer = ({ data }) => {
  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    setDisplayedData(data);
  }, [data]);

  return (
    <>
      <Flex direction="column" gap={0} overflowY="scroll">
        {displayedData?.map(furniture => (
          <InputGroup key={furniture.id} variant="white">
            <Input value={furniture.name} isReadOnly />
            <InputRightAddon w="4em" justifyContent="center">
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

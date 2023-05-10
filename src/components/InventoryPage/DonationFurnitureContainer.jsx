import React, { useEffect, useState } from 'react';
import { InputGroup, Input, InputRightAddon, Flex } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';

const DonationFurnitureContainer = ({ data }) => {
  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    setDisplayedData(data);
  }, [data]);

  return (
    <Flex direction="column" alignItems="start" gap={2.5} mt="1rem" overflowY="scroll" maxH="300px">
      {displayedData?.map(furniture => (
        <InputGroup key={furniture.id} variant="white">
          <Input value={furniture.name} isReadOnly />
          <InputRightAddon bg="#EDF2F7" w="4em" justifyContent="center">
            {furniture.count}
          </InputRightAddon>
        </InputGroup>
      ))}
    </Flex>
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

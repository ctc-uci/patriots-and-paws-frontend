import React, { useEffect, useState } from 'react';
import { InputGroup, Input, InputRightAddon, Flex } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';

import { formatFurnitureData } from '../../utils/InventoryUtils';

const DonationFurnitureContainer = ({ data }) => {
  const [displayedData, setDisplayedData] = useState([]);

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: Math.ceil(data.length / 4),
    initialState: { currentPage: 1 },
  });

  const formattedData = formatFurnitureData(data);

  useEffect(() => {
    setDisplayedData(formattedData[currentPage - 1]);
  }, [currentPage]);

  return (
    <>
      <Flex direction="column" gap={3}>
        {displayedData?.map(furniture => (
          <InputGroup key={furniture.id}>
            <Input value={furniture.name} isDisabled />
            <InputRightAddon w="4em">{furniture.count}</InputRightAddon>
          </InputGroup>
        ))}
      </Flex>
      <br />
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
        <PaginationContainer justify="right">
          <PaginationPrevious>&lsaquo;</PaginationPrevious>
          <PaginationNext>&rsaquo;</PaginationNext>
        </PaginationContainer>
      </Pagination>
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

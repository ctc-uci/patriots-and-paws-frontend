import React, { useEffect, useState } from 'react';
import { ChakraProvider, InputGroup, Input, InputRightAddon } from '@chakra-ui/react';
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
    <ChakraProvider>
      <div>
        {displayedData.map(furniture => (
          <InputGroup key={furniture.id}>
            <Input value={furniture.name} isDisabled />
            <InputRightAddon>{furniture.count}</InputRightAddon>
            <br />
          </InputGroup>
        ))}
      </div>
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
        <PaginationContainer>
          <PaginationPrevious>&lsaquo;</PaginationPrevious>
          <PaginationNext>&rsaquo;</PaginationNext>
        </PaginationContainer>
      </Pagination>
    </ChakraProvider>
  );
};

DonationFurnitureContainer.propTypes = {
  data: PropTypes.arrayOf({
    id: PropTypes.string,
    name: PropTypes.string,
    cout: PropTypes.number,
  }),
};

DonationFurnitureContainer.defaultProps = {
  data: [],
};

export default DonationFurnitureContainer;

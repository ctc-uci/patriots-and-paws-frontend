import React, { useState, useEffect } from 'react';
import { Select, Stack, Text, ChakraProvider } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';

import { PNPBackend } from '../../utils/utils';

const PaginationFooter = ({ setData, table }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    // replace '32' in page count to total number of items / number of rows per page
    // pagesCount: Math.ceil(databaseEntryTotal{  } / rowsPerPage),
    pagesCount: Math.ceil(32 / rowsPerPage),
    initialState: { currentPage: 1 },
  });

  // when the number of rows or the next page is clicked, get the desired data from the backend
  useEffect(() => {
    // replace this line with the correct call to the backend with the given table and num rows/what page
    const pageInfo = {
      pageNum: currentPage,
      numEntries: rowsPerPage,
    };
    const res = PNPBackend.get(`/${table}`, pageInfo);
    setData(res.data);
  }, [currentPage, rowsPerPage]);

  return (
    <ChakraProvider>
      <Stack direction="row" my={2}>
        <Text>Show rows per page </Text>
        <Select placeholder="Select option">
          {/* when an option is selected, update rowsPerPage with setRowsPerPage useState funct */}
          <option value="10" onClick={setRowsPerPage(10)}>
            10
          </option>
          <option value="15" onClick={setRowsPerPage(15)}>
            15
          </option>
          <option value="20" onClick={setRowsPerPage(20)}>
            20
          </option>
        </Select>
      </Stack>
      <Text justify="right">
        {/* change '32' to total number of entries in table */}
        {(currentPage - 1) * rowsPerPage + 1}-{(currentPage - 1) * rowsPerPage + rowsPerPage} of 32
      </Text>
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
        <PaginationContainer justify="right">
          <PaginationPrevious>&lsaquo;</PaginationPrevious>
          <PaginationNext>&rsaquo;</PaginationNext>
        </PaginationContainer>
      </Pagination>
    </ChakraProvider>
  );
};

PaginationFooter.propTypes = {
  setData: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired,
};

export default PaginationFooter;

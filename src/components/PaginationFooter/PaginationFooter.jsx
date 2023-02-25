import React, { useState, useEffect } from 'react';
import { Select, Stack, Text, ChakraProvider } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import { PNPBackend } from '../../utils/utils';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';

const PaginationFooter = ({ count, setData, table }) => {
  // console.log('pagination footer');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    // replace '32' in page count to total number of items / number of rows per page
    // pagesCount: Math.ceil(databaseEntryTotal{  } / rowsPerPage),
    pagesCount: Math.ceil(count / rowsPerPage),
    initialState: { currentPage: 1 },
  });

  // when the number of rows or the next page is clicked, get the desired data from the backend
  useEffect(() => {
    // replace this line with the correct call to the backend with the given table and num rows/what page
    const refreshData = async () => {
      // numDonations, pageNum
      const { data } = await PNPBackend.get(
        `/${table}?numDonations=${rowsPerPage}&pageNum=${currentPage}`,
      );
      console.log(data);
      setData(data);
    };
    console.log(currentPage);
    console.log(rowsPerPage);
    refreshData();
  }, [currentPage, rowsPerPage]);

  return (
    <>
      <Stack direction="row" m={5}>
        <Text>Show rows per page </Text>
        <Select
          onChange={e => setRowsPerPage(e.target.value)}
          placeholder="Select option"
          w="10%"
          size="sm"
        >
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </Select>
        <Text justify="right">
          {(currentPage - 1) * rowsPerPage + 1}-
          {(currentPage - 1) * rowsPerPage + rowsPerPage < count
            ? (currentPage - 1) * rowsPerPage + rowsPerPage
            : count}{' '}
          of {count}
        </Text>
        <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
          <PaginationContainer justify="right">
            <PaginationPrevious>&lsaquo;</PaginationPrevious>
            <PaginationNext>&rsaquo;</PaginationNext>
          </PaginationContainer>
        </Pagination>
      </Stack>
    </>
  );
};

PaginationFooter.propTypes = {
  count: PropTypes.string.isRequired,
  setData: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired,
};

export default PaginationFooter;

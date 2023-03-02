import React, { useState, useEffect } from 'react';
import { Select, Flex, Text } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';
import { PNPBackend } from '../../utils/utils';

const PaginationFooter = ({ count, setData, table }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: Math.ceil(count / rowsPerPage),
    initialState: { currentPage: 1 },
  });

  // when the number of rows or the next page is clicked, get the desired data from the backend
  useEffect(() => {
    const refreshData = async () => {
      const { data } = await PNPBackend.get(
        `/${table}?numDonations=${rowsPerPage}&pageNum=${currentPage}`,
      );
      setData(data);
    };
    refreshData();
  }, [currentPage, rowsPerPage]);

  return (
    <Flex direction="row" m={5} justify="space-between">
      <Flex direction="row" gap={2}>
        <Text>Show rows per page </Text>
        <Select onChange={e => setRowsPerPage(e.target.value)} defaultValue={10} size="sm">
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </Select>
      </Flex>
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
        <PaginationContainer justify="right">
          <PaginationPrevious>&lsaquo;</PaginationPrevious>
          <PaginationNext>&rsaquo;</PaginationNext>
        </PaginationContainer>
      </Pagination>
    </Flex>
  );
};

PaginationFooter.propTypes = {
  count: PropTypes.string.isRequired,
  setData: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired,
};

export default PaginationFooter;
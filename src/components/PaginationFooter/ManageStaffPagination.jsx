import React, { useEffect, useState } from 'react';
import { Flex, Select, Text } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';

import formatStaffData from '../../utils/manageStaffUtils';

const ManageStaffPagination = ({ data, setData }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formattedData, setFormattedData] = useState([]);

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: Math.ceil(data.length / rowsPerPage),
    initialState: { currentPage: 1 },
  });

  useEffect(() => {
    const formatted = formatStaffData(data, rowsPerPage);
    setData(formatted[0]);
    setFormattedData(formatted);
  }, [data, rowsPerPage]);

  useEffect(() => {
    setData(formattedData[currentPage - 1]);
  }, [currentPage]);

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

ManageStaffPagination.propTypes = {
  setData: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      cout: PropTypes.number,
    }),
  ),
};

ManageStaffPagination.defaultProps = {
  data: [],
  setData: () => {},
};

export default ManageStaffPagination;

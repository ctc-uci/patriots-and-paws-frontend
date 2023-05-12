import React, { useEffect, useState } from 'react';
import { Flex, Select, Text, Box, Grid } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';

import formatStaffData from '../../utils/ManageStaffUtils';

const ManageStaffPagination = ({ data, setData }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formattedData, setFormattedData] = useState([]);
  const [itemCountString, setItemCountString] = useState('');

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: Math.ceil(data.length / rowsPerPage),
    initialState: { currentPage: 1 },
  });

  const calculateItemCount = dataLength => {
    const start = (currentPage - 1) * rowsPerPage + 1;

    setItemCountString(`${start} - ${start + Math.min(dataLength, rowsPerPage) - 1}`);
  };

  useEffect(() => {
    const formatted = formatStaffData(data, rowsPerPage);
    setData(formatted[0]);
    setFormattedData(formatted);
    calculateItemCount(formatted[0].length);
    setCurrentPage(1);
  }, [data, rowsPerPage]);

  useEffect(() => {
    const pageData = formattedData[currentPage - 1];
    setData(pageData);
    calculateItemCount(pageData?.length);
  }, [currentPage]);

  return (
    <Flex
      direction="row"
      justify="space-between"
      border="solid"
      borderWidth="0px 1px 1px 1px"
      borderColor="#E2E8F0"
      px="24px"
      py="10px"
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={5} alignItems="center">
        <Box fontSize="14px" width="100%" whitespace="nowrap">
          Show rows per page&nbsp;
        </Box>
        <Select
          onChange={e => setRowsPerPage(e.target.value)}
          defaultValue={10}
          size="sm"
          width="50%"
        >
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </Select>
      </Grid>
      <Flex align="center" gap={5}>
        <Text fontSize="14px" fontWeight={400} color="gray.500">
          <Text as="span" fontSize="14px" fontWeight={400} color="gray.700">
            {itemCountString}
          </Text>
          &nbsp;of {data.length}
        </Text>
        <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
          <PaginationContainer justify="right" gap="8px">
            <PaginationPrevious variant="ghost">&lsaquo;</PaginationPrevious>
            <PaginationNext variant="ghost">&rsaquo;</PaginationNext>
          </PaginationContainer>
        </Pagination>
      </Flex>
    </Flex>
  );
};

ManageStaffPagination.propTypes = {
  setData: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      count: PropTypes.number,
    }),
  ),
};

ManageStaffPagination.defaultProps = {
  data: [],
  setData: () => {},
};

export default ManageStaffPagination;

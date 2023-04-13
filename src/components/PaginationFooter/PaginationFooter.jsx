import React, { useState, useEffect } from 'react';
import { Select, Flex, Box, HStack, Text } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';
import { PNPBackend } from '../../utils/utils';

const PaginationFooter = ({ setData, table, tab }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [itemCountString, setItemCountString] = useState('');
  const [donationCount, setDonationCount] = useState(0);

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: Math.ceil(donationCount / rowsPerPage),
    initialState: { currentPage: 1 },
  });

  const calculateItemCount = dataLength => {
    const start = (currentPage - 1) * rowsPerPage + 1;

    setItemCountString(`${start} - ${start + dataLength - 1}`);
  };

  // when the number of rows or the next page is clicked, get the desired data from the backend
  useEffect(() => {
    const refreshData = async () => {
      const { data } = await PNPBackend.get(
        `/${table}?numDonations=${rowsPerPage}&pageNum=${currentPage}&tab=${tab}`,
      );
      const { count, donations } = data;
      setData(donations);
      setDonationCount(count[0].count);
      calculateItemCount(donations.length);
    };
    refreshData();
  }, [currentPage, rowsPerPage, tab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  return (
    <Flex
      direction="row"
      justify="space-between"
      border="solid"
      borderWidth="1px"
      borderColor="#E2E8F0"
      mx={5}
      p={3}
    >
      <HStack width="17%" spacing={0}>
        <Box fontSize="14px" width="100%">
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
      </HStack>
      <Flex align="center" gap={5}>
        <Text fontSize="14px">
          <Text as="b" fontSize="14px">
            {itemCountString}
          </Text>
          &nbsp;of {donationCount}
        </Text>
        <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
          <PaginationContainer justify="right">
            <PaginationPrevious variant="ghost">&lsaquo;</PaginationPrevious>
            <PaginationNext variant="ghost">&rsaquo;</PaginationNext>
          </PaginationContainer>
        </Pagination>
      </Flex>
    </Flex>
  );
};

PaginationFooter.propTypes = {
  setData: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
};

export default PaginationFooter;

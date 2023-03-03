import React from 'react';
import { Tag, Box, Text, Grid, GridItem } from '@chakra-ui/react';

const DonationDetails = () => {
  return (
    <Grid h="200px" templateRows="repeat(2, 1fr)" templateColumns="repeat(6, 1fr)" gap={4}>
      <GridItem colSpan={2}>
        <Tag bg="blue.50">Submitted</Tag>
      </GridItem>
      <GridItem colSpan={2}>
        <Text>Form #1234</Text>
      </GridItem>
      <GridItem colSpan={2}>
        <Text>Submitted on 2/30/69</Text>
      </GridItem>
      <GridItem colSpan={2} bg="tomato" />
      <GridItem colStart={4} colSpan={4}>
        <Box>
          <Text>Row 1</Text>
          <Text>Row 2</Text>
          <Text>Row 3</Text>
          <Text>Row 4</Text>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default DonationDetails;

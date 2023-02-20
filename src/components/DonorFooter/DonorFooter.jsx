import React from 'react';
import { Grid, GridItem, Link } from '@chakra-ui/react';

const DonorFooter = () => {
  return (
    <footer
      style={{
        backgroundColor: 'white',
        borderWidth: '4px 0px 0px 0px',
        borderColor: '#3182CE #fff #fff #fff',
      }}
    >
      <Grid
        templateColumns="repeat(12, 1fr)"
        p="20px 40px 20px 40px"
        fontSize="15px"
        fontWeight="500"
        textAlign="center"
      >
        <GridItem colSpan={1}>
          <Link href="https://www.patriotsandpaws.org/our-story/">About Us</Link>
        </GridItem>
        <GridItem colSpan={1}>
          <Link href="https://www.patriotsandpaws.org/wanted/">Volunteer</Link>
        </GridItem>
        <GridItem colSpan={1}>
          <Link href="https://www.patriotsandpaws.org/asked-questions/">FAQ</Link>
        </GridItem>
        <GridItem colSpan={2}>
          <Link href="https://www.patriotsandpaws.org/donors">Donors & Supporters</Link>
        </GridItem>
        <GridItem colSpan={2} textAlign="center">
          <Link href="https://www.patriotsandpaws.org/" color="red.500" fontSize="20px">
            Patriots & Paws
          </Link>
        </GridItem>
      </Grid>
    </footer>
  );
};

export default DonorFooter;

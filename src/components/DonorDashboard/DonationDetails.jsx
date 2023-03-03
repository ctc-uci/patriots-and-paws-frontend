import React from 'react';
import { Tag, Box, Text, Grid, GridItem } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import DonationFurnitureContainer from '../InventoryPage/DonationFurnitureContainer';
import DonationImagesContainer from '../InventoryPage/DonationImagesContainer';
// import { formatDate } from '../../utils/routesUtils';

const DonationDetails = ({ data }) => {
  // const {
  //   id,
  //   status,
  //   firstName,
  //   lastName,
  //   submittedDate,
  //   addressStreet,
  //   addressUnit,
  //   addressCity,
  //   addressZip,
  //   email,
  //   phoneNum,
  //   notes,
  //   pictures,
  //   furniture,
  //   pickupDate,
  //   routeId,
  // } = data;
  console.log(data);
  if (data) {
    return (
      <Grid h="200px" templateRows="repeat(2, 1fr)" templateColumns="repeat(6, 1fr)" gap={4}>
        <GridItem colSpan={2}>
          <Tag bg="blue.50">{data.status}</Tag>
        </GridItem>
        <GridItem colSpan={2}>
          <Text>Form # {data.id}</Text>
        </GridItem>
        <GridItem colSpan={2}>
          <Text>Submitted on {data.submittedDate}</Text>
        </GridItem>
        <GridItem colSpan={2}>
          <DonationImagesContainer data={data.pictures} />
        </GridItem>
        <GridItem colStart={4} colSpan={4} rowSpan={2}>
          <Box overflow="scroll" maxH="sm">
            <DonationFurnitureContainer data={data.furniture} />
          </Box>
        </GridItem>
      </Grid>
    );
  }
  return <Text>Hi!</Text>;
};

DonationDetails.propTypes = {
  data: PropTypes.shape({
    status: PropTypes.string,
    id: PropTypes.number,
    addressStreet: PropTypes.string,
    addressUnit: PropTypes.string,
    addressCity: PropTypes.string,
    addressZip: PropTypes.number,
    firstName: PropTypes.string,
    furniture: PropTypes.arrayOf(PropTypes.string),
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNum: PropTypes.string,
    notes: PropTypes.string,
    submittedDate: PropTypes.string,
    pickupDate: PropTypes.string,
    routeId: PropTypes.number,
    pictures: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        imageURL: PropTypes.string,
        notes: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default DonationDetails;

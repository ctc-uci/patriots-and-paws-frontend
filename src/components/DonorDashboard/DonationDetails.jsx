import React from 'react';
import { Tag, TagLabel, Box, Text, Grid, GridItem, IconButton, Divider } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { PropTypes } from 'prop-types';
import DonationFurnitureContainer from '../InventoryPage/DonationFurnitureContainer';
import DonationImagesContainer from '../InventoryPage/DonationImagesContainer';

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
  const formatDate = date => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  // const [donation, setDonation] = useState();
  const displayStatusTag = () => {
    // pending
    if (data) {
      if (data.status === 'pending') {
        return (
          <Tag bg="blue.500">
            <TagLabel color="white"> Submitted </TagLabel>
          </Tag>
        );
      }
      // approved
      if (data.status === 'scheduling') {
        return (
          <Tag bg="green.500">
            <TagLabel color="white"> Approved </TagLabel>
          </Tag>
        );
      }
      // flagged
      if (data.status === 'changes requested') {
        // eslint-disable-next-line consistent-return
        return (
          <Tag bg="orange.500">
            <TagLabel color="white"> Changes Needed </TagLabel>
          </Tag>
        );
      }
    }
    return (
      <Tag bg="gray.50">
        <TagLabel color="black"> Invalid Status </TagLabel>
      </Tag>
    );
  };

  // eslint-disable-next-line consistent-return
  const displayEditIcon = () => {
    if (data.status === 'changes requested') {
      return <IconButton icon={<EditIcon />} />;
    }
  };
  // console.log(data);
  if (data) {
    return (
      <Grid h="200px" templateRows="repeat(2, 1fr)" templateColumns="repeat(6, 1fr)" gap={4}>
        <GridItem colSpan={2}>{displayStatusTag()}</GridItem>
        <GridItem colSpan={2}>
          <Text as="b">Form #{data.id}</Text>
        </GridItem>
        <GridItem colSpan={2}>
          <Text>Submitted on {formatDate(data.submittedDate)}</Text>
        </GridItem>
        <GridItem>
          {displayEditIcon()}
          <IconButton colorScheme="white" icon={<DeleteIcon color="red.500" />} />
        </GridItem>
        <Divider size="md" variant="thick" />
        <GridItem colSpan={2}>
          <Box borderRadius="6px">
            <DonationImagesContainer data={data.pictures} />
          </Box>
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

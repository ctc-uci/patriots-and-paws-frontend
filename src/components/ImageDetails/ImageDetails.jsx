import React from 'react';
import PropTypes from 'prop-types';
import { Input, Box, CloseButton, Image, Text } from '@chakra-ui/react';

function ImageDetails({ index, name, preview, description, removeImage, updateDescription }) {
  return (
    <Box>
      <Text>{name}</Text>
      <CloseButton
        onClick={() => {
          removeImage(index);
        }}
      />
      <Image key={preview} alt={name} src={preview} />
      <Input
        placeholder="Add description"
        onChange={ev => {
          updateDescription(index, ev.target.value);
        }}
        defaultValue={description}
      />
    </Box>
  );
}

ImageDetails.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.isRequired,
  preview: PropTypes.isRequired,
  description: PropTypes.isRequired,
  removeImage: PropTypes.func.isRequired,
  updateDescription: PropTypes.func.isRequired,
};

export default ImageDetails;

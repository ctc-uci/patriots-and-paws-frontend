import React from 'react';
import PropTypes from 'prop-types';
import { Input, Box, CloseButton } from '@chakra-ui/react';

function ImageDetails({ index, name, preview, setFilesIntermediate }) {
    // setFilesIntermediate(prev => {
    //     prev[i].description = '';
    //     return prev;
    // })
  return (
    <Box>
      <p>{name}</p>
      <CloseButton />
      <img
        key={preview}
        alt="pic"
        src={preview}
        // onLoad={() => {
        //   URL.revokeObjectURL(file.preview);
        // }}
      />
      <Input placeholder="Add description" />
    </Box>
  );
}

ImageDetails.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.isRequired,
  preview: PropTypes.isRequired,
  removeImage: PropTypes.func,
};

ImageDetails.defaultProps = {
  removeImage: null,
};

export default ImageDetails;

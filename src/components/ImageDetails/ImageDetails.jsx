import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Box, CloseButton } from '@chakra-ui/react';

function ImageDetails({ index, name, preview, removeImage, removeDescription, updateDescription }) {
  let currentDescription;
  const changeDescription = e => {
    updateDescription(index, e.target.value);
  };
  // const [currentDescription, setCurrentDescription] = useState();
  // setFilesIntermediate(prev => {
  //     prev[i].description = '';
  //     return prev;
  // })
  return (
    <Box>
      <p>{name}</p>
      <CloseButton
        onClick={() => {
          removeImage(index);
          removeDescription(index);
        }}
      />
      <img
        key={preview}
        alt="pic"
        src={preview}
        // onLoad={() => {
        //   URL.revokeObjectURL(file.preview);
        // }}
      />
      <Input
        placeholder="Add description"
        onChange={changeDescription}
        value={currentDescription}
      />
    </Box>
  );
}

ImageDetails.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.isRequired,
  preview: PropTypes.isRequired,
  // register: PropTypes.isRequired,
  removeImage: PropTypes.func,
  removeDescription: PropTypes.func,
  updateDescription: PropTypes.func,
};

ImageDetails.defaultProps = {
  removeImage: null,
  removeDescription: null,
  updateDescription: null,
};

export default ImageDetails;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Box, CloseButton } from '@chakra-ui/react';

function ImageDetails({
  index,
  name,
  preview,
  defaultDescription,
  removeImage,
  removeDescription,
  updateDescription,
}) {
  const [currentDescription, setCurrentDescription] = useState(defaultDescription);

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
        onChange={ev => {
          setCurrentDescription(ev.target.value);
          updateDescription(index, ev.target.value);
        }}
        value={currentDescription}
      />
    </Box>
  );
}

ImageDetails.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.isRequired,
  preview: PropTypes.isRequired,
  defaultDescription: PropTypes.isRequired,
  removeImage: PropTypes.func.isRequired,
  removeDescription: PropTypes.func.isRequired,
  updateDescription: PropTypes.func.isRequired,
};

export default ImageDetails;

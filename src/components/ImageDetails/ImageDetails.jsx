import React from 'react';
import PropTypes from 'prop-types';
import { Input, CloseButton, Image, Text, Flex } from '@chakra-ui/react';

function ImageDetails({ index, name, preview, removeImage, description, updateDescription }) {
  return (
    <Flex
      w="15em"
      border="1px"
      borderColor="gray.200"
      borderRadius="10px"
      padding="10px"
      margin="5px"
      flexDirection="column"
      gap="5px"
    >
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between" gap="5px">
        <Image
          borderRadius="10px"
          boxSize="3em"
          objectFit="cover"
          key={preview}
          alt={name}
          src={preview}
        />
        <Text fontSize="sm">{name}</Text>
        <CloseButton
          onClick={() => {
            removeImage(index);
          }}
          color="red.500"
          size="md"
        />
      </Flex>
      <Input
        placeholder="Add description"
        defaultValue={description}
        onChange={ev => {
          updateDescription(index, ev.target.value);
        }}
      />
    </Flex>
  );
}

ImageDetails.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  preview: PropTypes.string.isRequired,
  removeImage: PropTypes.func.isRequired,
  description: PropTypes.string,
  updateDescription: PropTypes.func.isRequired,
};

ImageDetails.defaultProps = {
  description: '',
};

export default ImageDetails;

import React from 'react';
import PropTypes from 'prop-types';
import { Input, CloseButton, Image, Text, Flex } from '@chakra-ui/react';

function ImageDetails({
  index,
  name,
  preview,
  removeImage,
  description,
  updateDescription,
  openImageModal,
}) {
  return (
    <Flex
      w="100%"
      border="1px"
      borderColor="gray.200"
      borderRadius="6px"
      padding={5}
      mt={5}
      flexDirection="column"
    >
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Image
          borderRadius="6px"
          boxSize="3em"
          objectFit="cover"
          key={preview}
          alt={name}
          src={preview}
          onClick={openImageModal}
          _hover={{ cursor: 'pointer' }}
        />
        <Text fontSize="sm" onClick={openImageModal} _hover={{ cursor: 'pointer' }}>
          {name}
        </Text>
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
  openImageModal: PropTypes.func.isRequired,
};

ImageDetails.defaultProps = {
  description: '',
};

export default ImageDetails;

import React from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { Box, Text, Input, Image, Flex } from '@chakra-ui/react';
import imageIcon from '../../assets/InsertPhoto.svg';

const DropZone = ({ setFiles, maxFiles }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/jpg': ['.jpg'],
      'image/png': ['.png'],
    },
    onDrop: acceptedFiles => {
      setFiles(prev =>
        [
          ...prev,
          ...acceptedFiles.map(file => ({
            file: Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
            notes: '',
          })),
        ].slice(0, maxFiles),
      );
    },
  });

  return (
    <Box
      p={6}
      height={250}
      backgroundColor="gray.100"
      display="flex"
      justifyContent="center"
      alignItems="center"
      {...getRootProps()}
    >
      <Input type="file" display="none" variant="unstyled" {...getInputProps()} />
      <Flex alignItems="center" flexDirection="column">
        <Image src={imageIcon} color="black" boxSize="40px" />
        <Text fontSize="14px" fontWeight="400" whiteSpace="nowrap">
          Drag and drop images here or&nbsp;
          <Text
            as="span"
            fontSize="14px"
            textDecoration="underline"
            cursor="pointer"
            textColor="blue.700"
          >
            browse
          </Text>
        </Text>
        <Text fontSize="12px" textAlign="center" mt={2} textColor="gray.700">
          Accepted file types: JPEG, PNG, GIF
        </Text>
      </Flex>
    </Box>
  );
};

DropZone.propTypes = {
  setFiles: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
};

DropZone.defaultProps = {
  maxFiles: 16,
};

export default DropZone;

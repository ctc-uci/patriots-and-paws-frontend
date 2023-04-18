import React from 'react';
import { useDropzone } from 'react-dropzone';
// import { CloseIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { Box, Text, Input, Image, Flex } from '@chakra-ui/react';
import imageIcon from '../../assets/InsertPhoto.svg';

const DropZone = ({ files, setFiles, maxFiles }) => {
  const { getRootProps, getInputProps } = useDropzone({
    // isDragAccept, isDragReject
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/jpg': ['.jpg'],
      'image/png': ['.png'],
    },
    onDrop: acceptedFiles => {
      setFiles(prev => [
        ...prev,
        ...acceptedFiles.map(file => ({
          file: Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
          notes: '',
        })),
      ]);
    },
  });

  // const dropzoneBox = useMemo(() => {
  //   let base = 'dropzone-zone';
  //   base += isDragAccept ? ' dropzone-accept' : '';
  //   base += isDragReject ? ' dropzone-reject' : '';
  //   return base;
  // }, [isDragReject, isDragAccept]);

  // const acceptedFileItems = acceptedFiles.map(acceptedFile => (
  //   <li key={acceptedFile.path} className="file-item">
  //     <button
  //       className="file-item-span"
  //       type="button"
  //       aria-label="Remove"
  //       onClick={removeUploadedPhoto}
  //     >
  //       <CloseIcon w={4} h={4} className="remove-uploaded-photo-button" />
  //     </button>
  //     <span className="file-item-span">{acceptedFile.path}</span>
  //   </li>
  // ));

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
      <Input
        type="file"
        display="none"
        variant="unstyled"
        disabled={files.length >= maxFiles}
        {...getInputProps()}
      />
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
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      imageURL: PropTypes.string,
      notes: PropTypes.string,
    }),
  ).isRequired,
  setFiles: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
};

DropZone.defaultProps = {
  maxFiles: 16,
};

export default DropZone;

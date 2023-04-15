import React from 'react';
import { useDropzone } from 'react-dropzone';
// import { CloseIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import './DropZone.css';

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
    <>
      <div className="dropzone-zone" {...getRootProps()}>
        <input {...getInputProps()} disabled={files.length >= maxFiles} />
        <div>
          <span className="dropzone-text">Click/drag file to upload</span>
          <p className="dropzone-support-text">Support for jpeg, jpg, png</p>
        </div>
      </div>
    </>
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

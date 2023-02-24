import React, { useEffect, useState } from 'react';
import { ChakraProvider, SimpleGrid, Image, useDisclosure } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from '@ajna/pagination';

import ImageModal from './ImageModal';
import { formatImageData } from '../../utils/InventoryUtils';

const DonationImagesContainer = ({ data }) => {
  const {
    isOpen: isOpenImageModal,
    onOpen: onOpenImageModal,
    onClose: onCloseImageModal,
  } = useDisclosure();

  const numPictures = data.length;
  const itemsPerPage = numPictures < 4 ? 1 : 4;

  const [currentImage, setCurrentImage] = useState();
  const [displayedData, setDisplayedData] = useState([]);

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: Math.ceil(numPictures / itemsPerPage),
    initialState: { currentPage: 1 },
  });

  const formattedData = formatImageData(data);

  useEffect(() => {
    setDisplayedData(formattedData[currentPage - 1]);
  }, [currentPage]);

  const handleImageClick = image => {
    setCurrentImage(image);
    onOpenImageModal();
  };

  return (
    <ChakraProvider>
      <SimpleGrid columns={2} gap={1}>
        {displayedData?.map(image => (
          <Image
            key={image.id}
            alt={image.notes}
            src={image.imageUrl}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </SimpleGrid>
      <ImageModal
        isOpenImageModal={isOpenImageModal}
        onOpenImageModal={onOpenImageModal}
        onCloseImageModal={onCloseImageModal}
        image={currentImage}
      />
      <br />
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
        <PaginationContainer justify="right">
          <PaginationPrevious>&lsaquo;</PaginationPrevious>
          <PaginationNext>&rsaquo;</PaginationNext>
        </PaginationContainer>
      </Pagination>
    </ChakraProvider>
  );
};

DonationImagesContainer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      imageURL: PropTypes.string,
      notes: PropTypes.string,
    }),
  ),
};

DonationImagesContainer.defaultProps = {
  data: [],
};

export default DonationImagesContainer;

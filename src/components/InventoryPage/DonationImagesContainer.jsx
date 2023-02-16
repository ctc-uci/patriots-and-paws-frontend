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
import { formatData } from '../../utils/InventoryUtils';

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

  const formattedData = formatData(data);

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
        {displayedData.map(image => (
          <Image
            key={image.id}
            h={300}
            w={395}
            alt="test"
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
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
        <PaginationContainer>
          <PaginationPrevious>&lsaquo;</PaginationPrevious>
          <PaginationNext>&rsaquo;</PaginationNext>
        </PaginationContainer>
      </Pagination>
    </ChakraProvider>
  );
};

DonationImagesContainer.propTypes = {
  data: PropTypes.arrayOf({
    id: PropTypes.string,
    imageURL: PropTypes.string,
    notes: PropTypes.string,
  }),
};

DonationImagesContainer.defaultProps = {
  data: [],
};

export default DonationImagesContainer;

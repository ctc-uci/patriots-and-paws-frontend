import React, { useEffect, useState } from 'react';
import { SimpleGrid, Image, useDisclosure, Box, Text, Flex, GridItem } from '@chakra-ui/react';
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
import imageIcon from '../../assets/InsertPhoto.svg';

const DonationImagesContainer = ({ pictures, numColDisplay }) => {
  const {
    isOpen: isOpenImageModal,
    onOpen: onOpenImageModal,
    onClose: onCloseImageModal,
  } = useDisclosure();

  const numPictures = pictures.length;
  const itemsPerPage = numPictures < 4 || numColDisplay === 1 ? 1 : 4;

  const [currentImage, setCurrentImage] = useState();
  const [displayedData, setDisplayedData] = useState([]);
  const [formattedData, setFormattedData] = useState(() => formatImageData(pictures, 1));

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: Math.ceil(numPictures / itemsPerPage),
    initialState: { currentPage: 1 },
  });

  useEffect(() => {
    setFormattedData(formatImageData(pictures, 1));
  }, [pictures]);

  useEffect(() => {
    setDisplayedData(formattedData[currentPage - 1]);
  }, [currentPage]);

  const handleImageClick = image => {
    setCurrentImage(image);
    onOpenImageModal();
  };

  return (
    <Flex>
      <Box p="2em">
        {numPictures > 0 ? (
          <>
            <ImageModal
              isOpenImageModal={isOpenImageModal}
              onOpenImageModal={onOpenImageModal}
              onCloseImageModal={onCloseImageModal}
              image={currentImage}
            />
            <Pagination
              pagesCount={pagesCount}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            >
              <PaginationContainer alignItems="center" justify="space-between" gap={5}>
                <PaginationPrevious>&lsaquo;</PaginationPrevious>
                <SimpleGrid
                  columns={itemsPerPage === 1 || numColDisplay === 1 ? 1 : 2}
                  align-items="center"
                  spacing={1}
                  w="100%"
                >
                  {displayedData?.map(image => (
                    <GridItem key={image.id} align="center">
                      <Image
                        alt={image.notes}
                        src={image.imageUrl}
                        objectFit="contain"
                        width="12rem"
                        height="10rem"
                        align="center"
                        onClick={image.imageUrl ? () => handleImageClick(image) : () => {}}
                        fallback={!image.imageUrl && <Box width="12rem" height="10rem" />}
                      />
                    </GridItem>
                  ))}
                </SimpleGrid>
                <PaginationNext>&rsaquo;</PaginationNext>
              </PaginationContainer>
            </Pagination>
          </>
        ) : (
          <Flex p="3em" direction="column" alignItems="center">
            <Image src={imageIcon} h="3em" w="3em" />
            <Text color="gray.500">No Images Uploaded</Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

DonationImagesContainer.propTypes = {
  pictures: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      imageURL: PropTypes.string,
      notes: PropTypes.string,
    }),
  ),
  numColDisplay: PropTypes.number,
};

DonationImagesContainer.defaultProps = {
  pictures: [],
  numColDisplay: 2,
};

export default DonationImagesContainer;

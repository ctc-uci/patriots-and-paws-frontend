import React, { useEffect, useState } from 'react';
import {
  SimpleGrid,
  Image,
  useDisclosure,
  Box,
  Text,
  Flex,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react';
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

const DonationImagesContainer = ({ pictures, itemsPerPage }) => {
  const {
    isOpen: isOpenImageModal,
    onOpen: onOpenImageModal,
    onClose: onCloseImageModal,
  } = useDisclosure();

  const numPictures = pictures.length;

  const [currentImage, setCurrentImage] = useState();
  const [displayedData, setDisplayedData] = useState([]);
  const [formattedData, setFormattedData] = useState(() => formatImageData(pictures, itemsPerPage));
  const responsiveItemsPerPage = useBreakpointValue(
    {
      base: 1,
      md: itemsPerPage,
    },
    {
      fallback: 1,
    },
  );

  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: Math.ceil(numPictures / (responsiveItemsPerPage ?? 1)),
    initialState: { currentPage: 1 },
  });

  useEffect(() => {
    setFormattedData(formatImageData(pictures, responsiveItemsPerPage ?? 1));
  }, [pictures]);

  useEffect(() => {
    const newFormattedData = formatImageData(pictures, responsiveItemsPerPage ?? 1);
    setFormattedData(newFormattedData);
    if (currentPage === 1) {
      setDisplayedData(newFormattedData[currentPage - 1]);
      return;
    }
    const maxPage = newFormattedData.length;
    if (responsiveItemsPerPage === 1) {
      setCurrentPage((currentPage - 1) * 4 + 1);
    } else {
      const newPageNum = Math.min(maxPage, Math.ceil(currentPage / 4) + 1);
      setCurrentPage(newPageNum);
    }
  }, [responsiveItemsPerPage]);

  useEffect(() => {
    setDisplayedData(formattedData[currentPage - 1]);
  }, [currentPage]);

  const handleImageClick = image => {
    setCurrentImage(image);
    onOpenImageModal();
  };

  return numPictures > 0 ? (
    <>
      <ImageModal
        isOpenImageModal={isOpenImageModal}
        onOpenImageModal={onOpenImageModal}
        onCloseImageModal={onCloseImageModal}
        image={currentImage}
      />
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={setCurrentPage}>
        <PaginationContainer
          alignItems="center"
          justify="space-between"
          gap={5}
          borderRadius="6px"
          position="relative"
          p="1em 2em"
          justifyContent="center"
          maxH="400px"
        >
          <PaginationPrevious position="absolute" left={0}>
            &lsaquo;
          </PaginationPrevious>
          <SimpleGrid
            columns={responsiveItemsPerPage === 1 ? 1 : 2}
            alignItems="center"
            spacing={1}
          >
            {displayedData?.map(image => (
              <GridItem key={image.id} align="center">
                <Image
                  alt={image.notes}
                  src={image.imageUrl}
                  objectFit="cover"
                  h="10rem"
                  align="center"
                  onClick={image.imageUrl ? () => handleImageClick(image) : () => {}}
                  fallback={!image.imageUrl && <Box width="12rem" height="10rem" />}
                />
              </GridItem>
            ))}
          </SimpleGrid>
          <PaginationNext position="absolute" right={0}>
            &rsaquo;
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
    </>
  ) : (
    <Flex p="3em" direction="column" alignItems="center">
      <Image src={imageIcon} h="3em" w="3em" />
      <Text color="gray.500">No Images Uploaded</Text>
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
  itemsPerPage: PropTypes.number,
};

DonationImagesContainer.defaultProps = {
  pictures: [],
  itemsPerPage: 4,
};

export default DonationImagesContainer;

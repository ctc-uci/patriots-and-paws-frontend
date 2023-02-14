import { Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import React from 'react';

const ItemCard = () => {
  const text = 'coffee';
  return (
    <>
      <Tag size="lg" borderRadius="full" variant="solid" colorScheme="red">
        <TagLabel>{text}</TagLabel>
        <TagCloseButton />
      </Tag>
    </>
  );
};

export default ItemCard;

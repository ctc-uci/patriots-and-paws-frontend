import { Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import React from 'react';

const ItemCard = ({ name }) => {
  return (
    <Tag size="lg" borderRadius="5" variant="solid" colorScheme="gray">
      <TagLabel>{name}</TagLabel>
      {/* On click, delete this item */}
      <TagCloseButton />
    </Tag>
  );
};

export default ItemCard;

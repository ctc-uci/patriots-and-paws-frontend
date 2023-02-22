import { Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import React from 'react';

import { PropTypes } from 'prop-types';

const ItemCard = ({ name, items, setItems, setDeletedEntries }) => {
  const handleDelete = () => {
    setItems(items.filter(item => item.name !== name));
    setDeletedEntries(prev => [...prev, name]);
  };

  return (
    <Tag size="lg" borderRadius="5" variant="solid" colorScheme="gray">
      <TagLabel>{name}</TagLabel>
      {/* On click, delete this item */}
      <TagCloseButton onClick={handleDelete} />
    </Tag>
  );
};

ItemCard.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      accepted: PropTypes.bool,
    }),
  ).isRequired,
  setItems: PropTypes.func.isRequired,
  setDeletedEntries: PropTypes.func.isRequired,
};

export default ItemCard;

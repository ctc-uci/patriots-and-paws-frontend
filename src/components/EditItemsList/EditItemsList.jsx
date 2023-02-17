import React, { useState, useEffect, useRef } from 'react';
import { Wrap, Input, Box, Button, Flex } from '@chakra-ui/react';
import ItemCard from '../ItemCard/ItemCard';

const EditItemsList = ({ items, setItems, setNewEntries, isAccepted = false }) => {
  const ref = useRef();

  const handleAdd = () => {
    // add validation to make sure current value isn't already in items
    // if it is already in items, set an error message (see chakra form control)
    setItems(prev => [...prev, { name: ref.current.value, accepted: isAccepted }]);
    setNewEntries(prev => [...prev, { name: ref.current.value, accepted: isAccepted }]);
  };

  return (
    <Box bg="gray.50" width="50%" height="100%" mx="3vh" overflow="hidden">
      <Wrap height="100%" minHeight="50vh" my="3%">
        {items
          .filter(({ accepted }) => accepted === isAccepted)
          .map(({ name }) => (
            <ItemCard key={name} name={name} />
          ))}
      </Wrap>
      <Flex>
        <Input ref={ref} />
        <Button onClick={handleAdd}> Add Item to List</Button>
      </Flex>
    </Box>
  );
};

export default EditItemsList;

import React, { useRef } from 'react';
import {
  Wrap,
  Input,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import ItemCard from '../ItemCard/ItemCard';

const EditItemsList = ({ items, setItems, setNewEntries, setDeletedEntries, isAccepted }) => {
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
            <ItemCard
              key={name}
              name={name}
              items={items}
              setItems={setItems}
              setDeletedEntries={setDeletedEntries}
            />
          ))}
      </Wrap>
      <Flex>
        <FormControl>
          <Input placeholder="Item" />
        </FormControl>
        <Button onClick={handleAdd}> Add Item to List</Button>
      </Flex>
    </Box>
  );
};

EditItemsList.defaultProps = {
  isAccepted: false,
};

EditItemsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      accepted: PropTypes.bool,
    }),
  ).isRequired,
  setItems: PropTypes.func.isRequired,
  setNewEntries: PropTypes.func.isRequired,
  setDeletedEntries: PropTypes.func.isRequired,
  isAccepted: PropTypes.bool,
};

export default EditItemsList;

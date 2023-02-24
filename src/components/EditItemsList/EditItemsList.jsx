import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Wrap, Input, Box, Button, Flex, FormControl } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import ItemCard from '../ItemCard/ItemCard';

const EditItemsList = ({ items, setItems, setNewEntries, setDeletedEntries, isAccepted }) => {
  const formSchema = yup.object({
    furnitureName: yup.string().required('Please enter the furniture name'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const handleAdd = e => {
    // add validation to make sure current value isn't already in items
    // if it is already in items, set an error message (see chakra form control)
    if (
      items.some(itemName => {
        return e.furnitureName === itemName.name;
      })
    ) {
      errors.furnitureName.message = 'Furniture item already exists';
      return;
    }
    setItems(prev => [...prev, { name: e.furnitureName, accepted: isAccepted }]);
    setNewEntries(prev => [...prev, { name: e.furnitureName, accepted: isAccepted }]);
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
        <form onSubmit={handleSubmit(handleAdd)}>
          <FormControl>
            <Input id="furnitureName" placeholder="Item" {...register('furnitureName')} />
            <Button type="submit"> Add Item to List</Button>
            <Box>{errors.furnitureName?.message}</Box>
          </FormControl>
        </form>
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

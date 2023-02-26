import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Wrap, Input, Box, Button, Flex, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import ItemCard from '../ItemCard/ItemCard';

const EditItemsList = ({ items, setItems, setNewEntries, setDeletedEntries, isAccepted }) => {
  const formSchema = yup.object({
    furnitureName: yup.string(),
  });
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    delayError: 750,
  });

  const handleAdd = ({ furnitureName }) => {
    // add validation to make sure current value isn't already in items
    // if it is already in items, set an error message (see chakra form control)
    if (!furnitureName) {
      setError('furnitureName', {
        type: 'focus',
        message: 'Please enter a furniture name',
        shouldFocus: true,
      });
    } else if (
      items.some(itemName => {
        return furnitureName.toLowerCase() === itemName.name.toLowerCase();
      })
    ) {
      setError('furnitureName', {
        type: 'focus',
        message: 'Furniture item already exists',
        shouldFocus: true,
      });
    } else {
      setItems(prev => [...prev, { name: furnitureName, accepted: isAccepted }]);
      setNewEntries(prev => [...prev, { name: furnitureName, accepted: isAccepted }]);
      reset({ furnitureName: '' });
    }
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
          <FormControl isInvalid={errors.furnitureName?.message}>
            <Input id="furnitureName" placeholder="Item" {...register('furnitureName')} />
            <Button type="submit"> Add Item to List</Button>
            <FormErrorMessage>{errors.furnitureName?.message}</FormErrorMessage>
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

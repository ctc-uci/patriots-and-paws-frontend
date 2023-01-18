/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Select, FormLabel, Button } from '@chakra-ui/react';
import styles from './FurnitureField.module.css';

function FurnitureField({ index, register, removeFurniture }) {
  const furnitureOptions = [
    'Dressers',
    'Clean Housewares',
    'Antiques',
    'Art',
    'Clean rugs',
    'Home Decor items',
    'Pet care items',
    'Patio Furniture',
  ];

  return (
    <div className={styles['field-section']}>
      <h1 className={styles.title}> Furniture {index + 1} </h1>
      <div className={styles['field-spacing']}>
        <FormLabel>Items to be Donated</FormLabel>
        <Select
          placeholder="Select furniture"
          defaultChecked="Select furniture"
          {...register(`furnitureField.${index}.itemName`)}
        >
          {furnitureOptions.map((furnitureItem, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={i}>{furnitureItem}</option>
          ))}
        </Select>
      </div>
      <Button onClick={() => removeFurniture(index)}>Delete</Button>
    </div>
  );
}
FurnitureField.propTypes = {
  index: PropTypes.number.isRequired,
  register: PropTypes.isRequired,
  removeFurniture: PropTypes.isRequired,
};

export default FurnitureField;

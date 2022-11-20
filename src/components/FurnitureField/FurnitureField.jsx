/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Select, FormLabel, Input } from '@chakra-ui/react';
import styles from './FurnitureField.module.css';

function FurnitureField({ index, onFurnitureChange, onLinkChange, onDescriptionChange }) {
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
        <Select defaultChecked="Dressers" onChange={e => onFurnitureChange(e.target.value, index)}>
          {furnitureOptions.map((furnitureItem, i) => {
            // eslint-disable-next-line react/no-array-index-key
            return <option key={i}>{furnitureItem}</option>;
          })}
        </Select>
      </div>
      <div className={styles['field-spacing']}>
        <FormLabel>Furniture Image Link</FormLabel>
        <Input defaultValue="" onChange={e => onLinkChange(e.target.value, index)} />
      </div>
      <div className={styles['field-spacing']}>
        <FormLabel>Description</FormLabel>
        <Input defaultValue="" onChange={e => onDescriptionChange(e.target.value, index)} />
      </div>
    </div>
  );
}
FurnitureField.propTypes = {
  index: PropTypes.number.isRequired,
  onFurnitureChange: PropTypes.func.isRequired,
  onLinkChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
};

export default FurnitureField;

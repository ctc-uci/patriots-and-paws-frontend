/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  FormLabel,
  Input,
  InputGroup,
  Select,
  FormControl,
  FormErrorMessage,
  Button,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './DonationForm.module.css';
import FurnitureField from '../FurnitureField/FurnitureField';

const schema = yup.object({
  firstName: yup.string().required('Invalid first name'),
  lastName: yup.string().required('Invalid first name'),
  zipcode: yup.number().typeError('ZIP code must be a number'),
  email1: yup.string().email('Invalid email').required('Email required'),
  email2: yup.string().email('Invalid email').required('Email required'),
});

function DonationForm() {
  const {
    register,
    // control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [furnitureList, setFurnitureList] = useState([
    { itemToBeDonated: 'Dressers', imageLink: '', description: '' },
  ]);

  const onAddFurnitureField = () => {
    // setFurnitureList(furnitureList.concat(<FurnitureField />));
    setFurnitureList(
      furnitureList.concat({ itemToBeDonated: 'Dressers', imageLink: '', description: '' }),
    );
  };

  const onDeleteFurnitureField = index => {
    // setFurnitureList(furnitureList.concat(<FurnitureField />));
    setFurnitureList(furnitureList.slice(0, index).concat(furnitureList.slice(index + 1)));
  };

  const setFurnitureSelection = (newSelection, index) => {
    furnitureList.at(index).itemToBeDonated = newSelection;
  };

  const setImageLink = (newLink, index) => {
    furnitureList.at(index).imageLink = newLink;
  };

  const setDescription = (newDescription, index) => {
    furnitureList.at(index).description = newDescription;
  };

  return (
    <div className={styles['form-padding']}>
      {/* eslint-disable-next-line no-console */}
      <form onSubmit={handleSubmit(data => console.log(furnitureList.concat(data)))}>
        <div className={styles['field-section']}>
          <h1 className={styles.title}>Name</h1>
          <div className={styles.form}>
            <FormControl isInvalid={errors && errors.firstName} width="47%">
              <FormLabel>First</FormLabel>
              <Input {...register('firstName')} />
              <FormErrorMessage>{errors.firstName && errors.firstName.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors && errors.lastName} width="47%">
              <FormLabel>Last</FormLabel>
              <Input {...register('lastName')} />
              <FormErrorMessage>{errors.lastName && errors.lastName.message}</FormErrorMessage>
            </FormControl>
          </div>
        </div>

        <div className={styles['field-section']}>
          <h1 className={styles.title}>Address</h1>

          <FormControl>
            <FormLabel>Street Address</FormLabel>
            <Input {...register('streetAddres')} />
          </FormControl>

          <FormControl>
            <FormLabel>Address Line 2</FormLabel>
            <Input {...register('streetAddres2')} />
          </FormControl>

          <div className={styles.form}>
            <FormControl width="47%">
              <FormLabel>City </FormLabel>
              <Input {...register('city')} />
            </FormControl>

            <FormControl width="47%">
              <FormLabel>State</FormLabel>
              <Select {...register('state')}>
                <option>Alaska</option>
                <option>California</option>
                <option>Texas</option>
              </Select>
            </FormControl>
          </div>

          <FormControl isInvalid={errors && errors.zipcode} l>
            <FormLabel>ZIP Code</FormLabel>
            <Input {...register('zipcode')} />
            <FormErrorMessage>{errors.zipcode && errors.zipcode.message}</FormErrorMessage>
          </FormControl>
        </div>

        <div className={styles['field-section']}>
          <h1 className={styles.title}>Phone</h1>
          <InputGroup>
            <Input type="tel" {...register('phoneNumber')} />
          </InputGroup>
        </div>

        <div className={styles['field-section']}>
          <h1 className={styles.title}>Email</h1>
          <div className={styles.form}>
            <FormControl isInvalid={errors && errors.email1} width="47%">
              <FormLabel>Enter Email </FormLabel>
              <Input {...register('email1')} />
              <FormErrorMessage>{errors.email1 && errors.email1.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors && errors.email2} width="47%">
              <FormLabel>Confirm Email </FormLabel>
              <Input {...register('email2')} />
              <FormErrorMessage>{errors.email2 && errors.email2.message}</FormErrorMessage>
            </FormControl>
          </div>
        </div>

        <div className={styles['field-section']}>
          <h1 className={styles.title}>Furniture Submissions</h1>
          {/* First furniture field always required and will not have a delete */}
          <FurnitureField
            index={0}
            onFurnitureChange={setFurnitureSelection}
            onLinkChange={setImageLink}
            onDescriptionChange={setDescription}
          />

          {furnitureList.slice(1).map((furniture, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index}>
                <FurnitureField
                  index={index + 1}
                  onFurnitureChange={setFurnitureSelection}
                  onLinkChange={setImageLink}
                  onDescriptionChange={setDescription}
                />
                <Button onClick={() => onDeleteFurnitureField(index + 1)}>Delete</Button>
              </div>
            );
          })}
        </div>

        <div className={styles['field-section']}>
          <Button onClick={onAddFurnitureField}>Add new furniture field</Button>
        </div>

        <div className={styles['field-section']}>
          <h1 className={styles.title}>Do you Have any Questions or Comments</h1>
          <Input {...register('additional')} />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default DonationForm;

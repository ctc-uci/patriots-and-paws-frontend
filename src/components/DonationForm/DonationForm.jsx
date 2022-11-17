/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
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
  return (
    <div className={styles['form-padding']}>
      {/* eslint-disable-next-line no-console */}
      <form onSubmit={handleSubmit(data => console.log(data))}>
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
            <Input />
          </FormControl>

          <FormControl>
            <FormLabel>Address Line 2</FormLabel>
            <Input />
          </FormControl>

          <div className={styles.form}>
            <FormControl width="47%">
              <FormLabel>City </FormLabel>
              <Input />
            </FormControl>

            <FormControl width="47%">
              <FormLabel>State</FormLabel>
              <Select>
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
            <Input type="tel" />
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
          <h1 className={styles.title}>Items to be Donated</h1>
          <Input />
        </div>

        <div className={styles['field-section']}>
          <h1 className={styles.title}>Do you Have any Questions or Comments</h1>
          <Input />
        </div>

        <Button type={styles.submit}>Submit</Button>
      </form>
    </div>
  );
}

export default DonationForm;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  FormLabel,
  Input,
  Select,
  FormControl,
  FormErrorMessage,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './DonationForm.module.css';
import DropZone from '../DropZone/DropZone';
import { sendEmail } from '../../utils/utils';
import { createNewDonation, updateDonation } from '../../utils/donorUtils';
import uploadImage, { createNewFurniture } from '../../utils/furnitureUtils';
import dconfirmemailtemplate from '../EmailTemplates/dconfirmemailtemplate';
import ImageDetails from '../ImageDetails/ImageDetails';
import DonationCard from '../DonationCard/DonationCard';

const itemFieldSchema = {
  itemName: yup.string().required('A Furniture Selection is Required'),
};

const schema = yup.object({
  firstName: yup.string().required('Invalid first name'),
  lastName: yup.string().required('Invalid last name'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/[0-9]{10}/, 'Phone number must be 10 digits'),
  streetAddress: yup.string().required('Street Address is required'),
  city: yup.string().required('City is required'),
  zipcode: yup
    .string()
    .required('ZIP Code is required')
    .matches(/^[0-9]{5}$/, 'ZIP Code must be a number and exactly 5 digits'),
  email: yup.string().email('Invalid email').required('Email required'),
  email2: yup
    .string()
    .required('Email required')
    .oneOf([yup.ref('email'), null], 'Emails must both match'),
  Items: yup.array().of(yup.object().shape(itemFieldSchema), 'A Furniture Selection is Required'),
});

function DonationForm({ donationData, onClose }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [furnitureOptions, setFurnitureOptions] = useState([
    'Dressers',
    'Clean Housewares',
    'Antiques',
    'Art',
    'Clean rugs',
    'Home Decor items',
    'Pet care items',
    'Patio Furniture',
  ]);

  const [donatedFurnitureList, setDonatedFurniture] = useState([]);

  const [selectedFurnitureValue, setSelectedFurnitureValue] = useState('');

  const [files, setFiles] = useState([]);

  useEffect(() => {
    setDonatedFurniture(donationData.furniture);
    // setFiles(donationData.pictures);
  }, []);

  const removeFile = index => {
    setFiles(prev => prev.filter((item, idx) => idx !== index));
  };

  const updateDescription = (index, newDescription) => {
    setFiles(prev => {
      return prev
        .slice(0, index)
        .concat(
          [{ file: prev[index].file, description: newDescription }].concat(prev.slice(index + 1)),
        );
    });
  };

  const onSubmit = async data => {
    // await Promise.all(files.map(async file => uploadImage(file)));
    try {
      const formData = {
        ...donationData,
        ...data,
        furniture: donatedFurnitureList,
        // pictures: files,
      };
      console.log(formData);

      if (!donationData) {
        sendEmail(data.email, dconfirmemailtemplate);
        createNewDonation(formData);
        donatedFurnitureList.forEach(f => createNewFurniture(f));
        files.forEach(f => uploadImage(f));
      } else {
        updateDonation(donationData.id, formData);
        // closes the editDonationModal
        onClose();
      }
    } catch (err) {
      console.log(err.message);
      // to do: error message that email is invalid
    }
  };

  const removeDonation = removedName => {
    setFurnitureOptions(prev => [...prev, removedName]);
    const res = donatedFurnitureList.filter(e => e.name !== removedName);
    setDonatedFurniture(res);
  };

  const addDonation = async ev => {
    setDonatedFurniture(prev => [...prev, { name: ev.target.value, count: 1 }]);
    setFurnitureOptions(prev => prev.filter(e => e !== ev.target.value));
    setSelectedFurnitureValue('Select Furniture');
  };

  const changeDonation = (furnitureName, ev) => {
    const furniture = donatedFurnitureList.find(e => e.name === furnitureName);
    furniture.count = +ev;
  };

  return (
    <Box className={styles['form-padding']}>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Name
          </Heading>
          <Box className={styles.form}>
            <FormControl isInvalid={errors && errors.firstName} width="47%">
              <FormLabel>First</FormLabel>
              <Input {...register('firstName')} defaultValue={donationData.firstName} />
              <FormErrorMessage>{errors.firstName && errors.firstName.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors && errors.lastName} width="47%">
              <FormLabel>Last</FormLabel>
              <Input {...register('lastName')} defaultValue={donationData.lastName} />
              <FormErrorMessage>{errors.lastName && errors.lastName.message}</FormErrorMessage>
            </FormControl>
          </Box>
        </Box>

        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Address
          </Heading>

          <FormControl isInvalid={errors && errors.streetAddress}>
            <FormLabel>Street Address</FormLabel>
            <Input {...register('streetAddress')} defaultValue={donationData.addressStreet} />
            <FormErrorMessage>
              {errors.streetAddress && errors.streetAddress.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Address Line 2</FormLabel>
            <Input {...register('streetAddress2')} />
          </FormControl>

          <Box className={styles.form}>
            <FormControl width="47%" isInvalid={errors && errors.city}>
              <FormLabel>City </FormLabel>
              <Input {...register('city')} defaultValue={donationData.addressCity} />
              <FormErrorMessage>{errors.city && errors.city.message}</FormErrorMessage>
            </FormControl>

            <FormControl width="47%">
              <FormLabel>State</FormLabel>
              <Select defaultChecked="CA" disabled>
                <option>CA</option>
              </Select>
            </FormControl>
          </Box>

          <FormControl isInvalid={errors && errors.zipcode}>
            <FormLabel>ZIP Code</FormLabel>
            <Input {...register('zipcode')} defaultValue={donationData.addressZip} />
            <FormErrorMessage>{errors.zipcode && errors.zipcode.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Phone
          </Heading>
          <FormControl isInvalid={errors && errors.phoneNumber}>
            <Input type="tel" {...register('phoneNumber')} defaultValue={donationData.phoneNum} />
            <FormErrorMessage>{errors.phoneNumber && errors.phoneNumber.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Email
          </Heading>
          <Box className={styles.form}>
            <FormControl isInvalid={errors && errors.email} width="47%">
              <FormLabel>Enter Email </FormLabel>
              <Input {...register('email')} defaultValue={donationData.email} />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors && errors.email2} width="47%">
              <FormLabel>Confirm Email </FormLabel>
              <Input {...register('email2')} defaultValue={donationData.email} />
              <FormErrorMessage>{errors.email2 && errors.email2.message}</FormErrorMessage>
            </FormControl>
          </Box>
        </Box>

        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title} marginBottom="1em">
            Furniture
          </Heading>
          <Select
            placeholder="Select Furniture"
            value={selectedFurnitureValue}
            onChange={ev => addDonation(ev)}
            marginBottom="1em"
            w="80%"
          >
            {furnitureOptions.map(furnitureItem => (
              <option key={furnitureItem}>{furnitureItem}</option>
            ))}
          </Select>
          {donatedFurnitureList.map(donatedFurniture => (
            <DonationCard
              key={donatedFurniture.name}
              donatedFurniture={donatedFurniture}
              changeDon={changeDonation}
              removeDon={removeDonation}
            />
          ))}
        </Box>

        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title} marginBottom="1em">
            Images
          </Heading>

          <Box w="80%">
            <DropZone setFiles={setFiles} />
            <Flex wrap="wrap">
              {files.map(({ file: { name, preview }, description }, index) => {
                return (
                  <ImageDetails
                    key={name}
                    index={index}
                    name={name}
                    preview={preview}
                    description={description}
                    removeImage={removeFile}
                    updateDescription={updateDescription}
                  />
                );
              })}
            </Flex>
          </Box>
        </Box>

        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Do you Have any Questions or Comments
          </Heading>
          <Input {...register('additional')} defaultValue={donationData.notes} />
        </Box>
        <Button type="submit">{!donationData ? 'Submit' : 'Save'}</Button>
      </form>
    </Box>
  );
}

DonationForm.propTypes = {
  donationData: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    addressStreet: PropTypes.string,
    addressCity: PropTypes.string,
    addressUnit: PropTypes.string,
    addressZip: PropTypes.number,
    phoneNum: PropTypes.string,
    email: PropTypes.string,
    notes: PropTypes.string,
    furniture: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        count: PropTypes.number,
      }),
    ),
    pictures: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        imageURL: PropTypes.string,
        notes: PropTypes.string,
      }),
    ),
  }),
  onClose: PropTypes.func,
};

DonationForm.defaultProps = {
  donationData: {
    id: '',
    firstName: '',
    lastName: '',
    addressStreet: '',
    addressCity: '',
    addressUnit: '',
    addressZip: '',
    phoneNum: '',
    email: '',
    notes: '',
    furniture: [],
    pictures: [],
  },
  onClose: () => {},
};

export default DonationForm;

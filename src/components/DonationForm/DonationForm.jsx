import React, { useState } from 'react';
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
  useDisclosure,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './DonationForm.module.css';
import DropZone from '../DropZone/DropZone';
import { sendEmail } from '../../utils/utils';
import dconfirmemailtemplate from '../EmailTemplates/dconfirmemailtemplate';
import ImageDetails from '../ImageDetails/ImageDetails';
// import uploadImage from '../../utils/furnitureUtils';
import DonationCard from '../DonationCard/DonationCard';
import TermsConditionModal from '../TermsConditionModal/TermsConditionModal';

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
    .matches(/^[0-9]+$/, 'ZIP Code must be a number')
    .min(5, 'ZIP Code must be exactly 5 digits')
    .max(5, 'ZIP Code must be exactly 5 digits'),
  email1: yup.string().email('Invalid email').required('Email required'),
  email2: yup
    .string()
    .required('Email required')
    .oneOf([yup.ref('email1'), null], 'Emails must both match'),
  Items: yup.array().of(yup.object().shape(itemFieldSchema), 'A Furniture Selection is Required'),
  termsCond: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

function DonationForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

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
    // console.log(data);
    // console.log(donatedFurnitureList);
    // console.log(files);
    // await Promise.all(files.map(async file => uploadImage(file)));
    try {
      sendEmail(data.email1, dconfirmemailtemplate);
    } catch (err) {
      // console.log(err.message);
      // to do: error message that email is invalid
    }
  };

  const removeDonation = removedName => {
    setFurnitureOptions(prev => [...prev, removedName]);
    const res = donatedFurnitureList.filter(e => e.name !== removedName);
    setDonatedFurniture(res);
  };

  const addDonation = async ev => {
    setDonatedFurniture(prev => [...prev, { name: ev.target.value, num: 1 }]);
    setFurnitureOptions(prev => prev.filter(e => e !== ev.target.value));
    setSelectedFurnitureValue('Select Furniture');
  };

  const changeDonation = (furnitureName, ev) => {
    const furniture = donatedFurnitureList.find(e => e.name === furnitureName);
    furniture.num = +ev;
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
              <Input {...register('firstName')} />
              <FormErrorMessage>{errors.firstName && errors.firstName.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors && errors.lastName} width="47%">
              <FormLabel>Last</FormLabel>
              <Input {...register('lastName')} />
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
            <Input {...register('streetAddress')} />
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
              <Input {...register('city')} />
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
            <Input {...register('zipcode')} />
            <FormErrorMessage>{errors.zipcode && errors.zipcode.message}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Phone
          </Heading>
          <FormControl isInvalid={errors && errors.phoneNumber}>
            <Input type="tel" {...register('phoneNumber')} />
            <FormErrorMessage>{errors.phoneNumber && errors.phoneNumber.message}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Email
          </Heading>
          <Box className={styles.form}>
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
          <Input {...register('additional')} />
        </Box>

        <FormControl isInvalid={errors && errors.termsCond}>
          <Flex>
            <Checkbox {...register('termsCond')} />
            <Text>&nbsp;&nbsp;I agree to the&nbsp;</Text>
            <Text cursor="pointer" onClick={onOpen} as="u">
              terms and conditions.
            </Text>
          </Flex>
          <FormErrorMessage>{errors.termsCond && errors.termsCond.message}</FormErrorMessage>
        </FormControl>

        <TermsConditionModal onClose={onClose} onOpen={onOpen} isOpen={isOpen} isDonationForm />

        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
}

export default DonationForm;

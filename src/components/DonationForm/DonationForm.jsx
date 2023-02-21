/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Box,
  FormLabel,
  Input,
  Select,
  FormControl,
  FormErrorMessage,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
} from '@chakra-ui/react';
// import { CloseIcon } from '@chakra-ui/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
// import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './DonationForm.module.css';
// import FurnitureField from '../FurnitureField/FurnitureField';
import DropZone from '../DropZone/DropZone';
import { sendEmail } from '../../utils/utils';
import dconfirmemailtemplate from '../EmailTemplates/dconfirmemailtemplate';
import ImageDetails from '../ImageDetails/ImageDetails';
import uploadImage from '../../utils/furnitureUtils';
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
    .matches(/[0-9]{3}-[0-9]{3}-[0-9]{4}/, 'Phone number must match xxx-xxx-xxxx format'),
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
});

function DonationForm() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [furnitureOptions, setFurnitureOptions] = useState([
    // 'Select Furniture',
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

  const {
    fields: descriptionsIntermediateList,
    update: updateDescription,
    replace: replaceIntermediateDescriptions,
    append: appendDescription,
    remove: removeDescription,
  } = useFieldArray({
    control,
    name: 'ImageDetail',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [files, setFiles] = useState([]);
  const [filesIntermediate, setFilesIntermediate] = useState([]);
  const [descriptions, setDescriptions] = useState([]);

  const removeIntermediateFile = index => {
    setFilesIntermediate(
      filesIntermediate.filter(item => filesIntermediate.indexOf(item) !== index),
    );
  };

  const removeIntermediateDescription = index => {
    removeDescription(index);
  };

  const getDescription = index => {
    const descObj = descriptionsIntermediateList[index];
    if (descObj) {
      return Object.values(descObj).slice(0, -1).join('');
    }
    return '';
  };

  const updateIntermediateDescription = (index, newDescription) => {
    if (index >= descriptionsIntermediateList.length) {
      appendDescription('');
    }
    updateDescription(index, newDescription);
  };

  const onSubmit = async data => {
    await Promise.all(files.map(async file => uploadImage(file)));
    try {
      sendEmail(data.email1, dconfirmemailtemplate);
    } catch (err) {
      // to do: error message that email is invalid
    }
  };

  const onOpenModal = e => {
    setFilesIntermediate(files);
    replaceIntermediateDescriptions(descriptions);
    onOpen(e);
  };

  const onSave = e => {
    setFiles(filesIntermediate);
    setDescriptions(descriptionsIntermediateList);
    onClose(e);
  };

  const onCancel = e => {
    setFilesIntermediate(files);
    replaceIntermediateDescriptions(descriptions);
    onClose(e);
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

          <FormControl>
            <FormLabel>Street Address</FormLabel>
            <Input {...register('streetAddres')} />
          </FormControl>

          <FormControl>
            <FormLabel>Address Line 2</FormLabel>
            <Input {...register('streetAddres2')} />
          </FormControl>

          <Box className={styles.form}>
            <FormControl width="47%">
              <FormLabel>City </FormLabel>
              <Input {...register('city')} />
            </FormControl>

            <FormControl width="47%">
              <FormLabel>State</FormLabel>
              <Select
                placeholder="Select state"
                defaultChecked="Select state"
                {...register('state')}
              >
                <option>Alaska</option>
                <option>California</option>
                <option>Texas</option>
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

        <Select
          placeholder="Select Furniture"
          value={selectedFurnitureValue}
          onChange={ev => addDonation(ev)}
          className={styles['field-section']}
        >
          {furnitureOptions.map((furnitureItem, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={i}>{furnitureItem}</option>
          ))}
        </Select>

        {donatedFurnitureList.map((donatedFurniture, i) => (
          <DonationCard
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            donatedFurniture={donatedFurniture}
            changeDon={changeDonation}
            removeDon={removeDonation}
          />
        ))}

        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Images
          </Heading>
          <Button onClick={onOpenModal}>Upload Images</Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Images</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <DropZone setFiles={setFilesIntermediate} />
                {filesIntermediate.map(({ name, preview }, index) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <ImageDetails
                      index={index}
                      name={name}
                      preview={preview}
                      defaultDescription={getDescription(index)}
                      removeImage={removeIntermediateFile}
                      removeDescription={removeIntermediateDescription}
                      updateDescription={updateIntermediateDescription}
                    />
                  );
                })}
              </ModalBody>

              <ModalFooter>
                <Button mr={3} onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={onSave}>Save Images</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>

        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Do you Have any Questions or Comments
          </Heading>
          <Input {...register('additional')} />
        </Box>

        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
}

export default DonationForm;

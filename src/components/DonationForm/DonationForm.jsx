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
  // Card,
  Tag,
  TagCloseButton,
  TagLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
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

  const [DonatedFurnitureList, setDonatedFurniture] = useState([]);

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
    // const urls = await Promise.all(files.map(async file => uploadImage(file)));
    sendEmail(data.email1, dconfirmemailtemplate);
  };

  const onOpenModal = e => {
    setFilesIntermediate(files);
    replaceIntermediateDescriptions(descriptions);
    onOpen(e);
  };

  const onSave = e => {
    // console.log(descriptionsIntermediateList);
    setFiles(filesIntermediate);
    setDescriptions(descriptionsIntermediateList);
    // console.log(descriptions);
    onClose(e);
  };

  const onCancel = e => {
    // helper function for closing the model
    setFilesIntermediate(files);
    replaceIntermediateDescriptions(descriptions);
    onClose(e);
  };

  const addDonation = ev => {
    // appendDonation({ name: ev.target.value, num: 1 });
    setDonatedFurniture([...DonatedFurnitureList, { name: ev.target.value, num: 1 }]);
    setFurnitureOptions(prev => prev.filter(e => e !== ev.target.value));
  };

  const removeDonation = removedName => {
    console.log(removedName);
    setFurnitureOptions([...furnitureOptions, removedName]);
    setDonatedFurniture(prev => prev.filter(e => e.name !== removedName));
    // removeFurniture({ name: removedName });
  };

  const onSelectFurniture = async ev => {
    await addDonation(ev);
    setSelectedFurnitureValue('Select Furniture');
  };

  const changeDonation = (furnitureName, ev) => {
    const furniture = DonatedFurnitureList.find(e => e.name === furnitureName);
    furniture.num = +ev;
  };

  return (
    <Box className={styles['form-padding']}>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <Box className={styles['field-section']}>
          <h1 className={styles.title}>Name</h1>
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
          <h1 className={styles.title}>Address</h1>

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
          <h1 className={styles.title}>Phone</h1>
          <FormControl isInvalid={errors && errors.phoneNumber}>
            <Input type="tel" {...register('phoneNumber')} />
            <FormErrorMessage>{errors.phoneNumber && errors.phoneNumber.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <Box className={styles['field-section']}>
          <h1 className={styles.title}>Email</h1>
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

        {/* <Box className={styles['field-section']}>
          <h1 className={styles.title}>Furniture Submissions</h1>
          <FormControl isInvalid={errors && errors.Item}>
            {itemsList.map((furniture, index) => {
              if (index === 0) {
                // eslint-disable-next-line react/jsx-key
                return <FurnitureField index={index} register={register} />;
              }
              return (
                // eslint-disable-next-line react/jsx-key
                <FurnitureField index={index} register={register} removeFurniture={removeItem} />
              );
            })}
          </FormControl>
        </Box>

        <Box className={styles['field-section']}>
          <Button onClick={() => appendItem({})}>Add new furniture field</Button>
        </Box> */}
        <Select
          placeholder="Select Furniture"
          value={selectedFurnitureValue}
          onChange={ev => onSelectFurniture(ev)}
        >
          {furnitureOptions.map((furnitureItem, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={i}>{furnitureItem}</option>
          ))}
        </Select>

        {DonatedFurnitureList.map((donatedFurniture, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tag key={i}>
            <TagLabel>{donatedFurniture.name}</TagLabel>
            <NumberInput
              defaultValue={1}
              onChange={ev => changeDonation(donatedFurniture.name, ev)}
              min={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <TagCloseButton onClick={() => removeDonation(donatedFurniture.name)} />
          </Tag>
        ))}

        <Box className={styles['field-section']}>
          <h1 className={styles.title}>Images</h1>
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
          <h1 className={styles.title}>Do you Have any Questions or Comments</h1>
          <Input {...register('additional')} />
        </Box>

        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
}

export default DonationForm;

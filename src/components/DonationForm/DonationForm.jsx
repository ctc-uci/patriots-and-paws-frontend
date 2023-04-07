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
  useDisclosure,
  Checkbox,
  Text,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import styles from './DonationForm.module.css';
import DropZone from '../DropZone/DropZone';
import { PNPBackend, sendEmail } from '../../utils/utils';
import { createNewDonation, updateDonation } from '../../utils/DonorUtils';
import uploadImage from '../../utils/FurnitureUtils';
import dconfirmemailtemplate from '../EmailTemplates/dconfirmemailtemplate';
import ImageDetails from '../ImageDetails/ImageDetails';
import DonationCard from '../DonationCard/DonationCard';
import TermsConditionModal from '../TermsConditionModal/TermsConditionModal';
import ItemInfo from '../ItemInfo/ItemInfo';
import { STATUSES } from '../../utils/config';

const { APPROVAL_REQUESTED } = STATUSES;
const itemFieldSchema = {
  itemName: yup.string().required('A Furniture Selection is Required'),
};

const schema = yup.object({
  firstName: yup.string().required('Invalid first name'),
  lastName: yup.string().required('Invalid last name'),
  phoneNum: yup
    .string()
    .required('Phone number is required')
    .matches(/[0-9]{10}/, 'Phone number must be 10 digits'),
  addressStreet: yup.string().required('Street Address is required'),
  addressCity: yup.string().required('City is required'),
  addressZip: yup
    .string()
    .required('ZIP Code is required')
    .matches(/^[0-9]{5}$/, 'ZIP Code must be a number and exactly 5 digits'),
  email: yup.string().email('Invalid email').required('Email required'),
  email2: yup
    .string()
    .required('Email required')
    .oneOf([yup.ref('email'), null], 'Emails must both match'),
  Items: yup.array().of(yup.object().shape(itemFieldSchema), 'A Furniture Selection is Required'),
  termsCond: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

function DonationForm({ donationData, setDonationData, closeEditDonationModal }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { ...donationData, email2: donationData?.email },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const [furnitureOptions, setFurnitureOptions] = useState([]);

  const [donatedFurnitureList, setDonatedFurniture] = useState(donationData?.furniture ?? []);

  const [selectedFurnitureValue, setSelectedFurnitureValue] = useState('');

  const [files, setFiles] = useState(donationData?.pictures ?? []);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await PNPBackend.get('/furnitureOptions');
      const options = data.filter(({ accepted }) => accepted).map(({ name }) => name);
      if (donationData) {
        const furniture = new Set(donationData.furniture.map(({ name }) => name));
        const newOptions = options.filter(option => !furniture.has(option));
        setFurnitureOptions(newOptions);
      } else {
        setFurnitureOptions(options);
      }
    };
    loadData();
  }, []);
  const toast = useToast();

  const removeFile = index => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateDescription = (index, newNotes) => {
    setFiles(prev => {
      return prev
        .slice(0, index)
        .concat(
          [{ ...prev[index], file: prev[index].file, notes: newNotes }].concat(
            prev.slice(index + 1),
          ),
        );
    });
  };

  const onSubmit = async data => {
    // TODO: handle 0 furniture item validation
    const newUrls = await Promise.all(
      files
        .filter(file => file?.file)
        .map(async ({ file, notes }) => {
          const url = await uploadImage(file);
          return { imageUrl: url, notes };
        }),
    );

    const formData = {
      ...donationData,
      ...data,
      zip: parseInt(data.zipcode, 10),
      furniture: donatedFurnitureList,
      pictures: [...newUrls, ...files.filter(file => file?.imageUrl)],
    };

    if (!donationData) {
      const { id: donationId, email } = await createNewDonation(formData);
      try {
        sendEmail(
          'Thank You For Donating!',
          formData.email,
          dconfirmemailtemplate(donationId, email),
        );
      } catch (err) {
        // TODO: error message that email is invalid
        // console.log(err.message);
        return;
      }
      navigate('/donate/status', {
        state: { isLoggedIn: true, email: formData.email, donationId },
      });
      toast({
        title: 'Your Donation Has Been Succesfully Submitted!',
        description: 'An email has been sent with your donation ID',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } else {
      const newData = await updateDonation(donationData.id, formData);
      setDonationData(prev => newData ?? prev);
      // closes the editDonationModal
      await PNPBackend.put(`/donations/${donationData.id}`, {
        status: APPROVAL_REQUESTED,
      });
      closeEditDonationModal();
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

  const [itemsInfoList, setItemsInfoList] = useState([]);

  useEffect(() => {
    const fetchItemsInfoOptions = async () => {
      const { data } = await PNPBackend.get(`furnitureOptions`);
      setItemsInfoList(data);
    };
    fetchItemsInfoOptions();
  }, []);

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

          <FormControl isInvalid={errors && errors.addressStreet}>
            <FormLabel>Street Address</FormLabel>
            <Input {...register('addressStreet')} />
            <FormErrorMessage>
              {errors.addressStreet && errors.addressStreet.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Address Line 2</FormLabel>
            <Input {...register('addressUnit')} />
          </FormControl>

          <Box className={styles.form}>
            <FormControl width="47%" isInvalid={errors && errors.addressCity}>
              <FormLabel>City </FormLabel>
              <Input {...register('addressCity')} />
              <FormErrorMessage>
                {errors.addressCity && errors.addressCity.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl width="47%">
              <FormLabel>State</FormLabel>
              <Select defaultChecked="CA" disabled>
                <option>CA</option>
              </Select>
            </FormControl>
          </Box>

          <FormControl isInvalid={errors && errors.addressZip}>
            <FormLabel>ZIP Code</FormLabel>
            <Input {...register('addressZip')} />
            <FormErrorMessage>{errors.addressZip && errors.addressZip.message}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Phone
          </Heading>
          <FormControl isInvalid={errors && errors.phoneNum}>
            <Input type="tel" {...register('phoneNum')} />
            <FormErrorMessage>{errors.phoneNum && errors.phoneNum.message}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box className={styles['field-section']}>
          <Heading size="md" className={styles.title}>
            Email
          </Heading>
          <Box className={styles.form}>
            <FormControl isInvalid={errors && errors.email} width="47%">
              <FormLabel>Enter Email </FormLabel>
              <Input {...register('email')} disabled={donationData?.email} />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors && errors.email2} width="47%">
              <FormLabel>Confirm Email </FormLabel>
              <Input {...register('email2')} disabled={donationData?.email} />
              <FormErrorMessage>{errors.email2 && errors.email2.message}</FormErrorMessage>
            </FormControl>
          </Box>
        </Box>
        <Box className={styles['field-section']}>
          <Flex marginBottom="1em" align="center">
            <Heading size="md" className={styles.title} marginRight="1">
              Item
            </Heading>
            <ItemInfo items={itemsInfoList} isAccepted />
          </Flex>
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
              {files.map(({ file, id, imageUrl, notes }, index) => {
                return (
                  <ImageDetails
                    key={file?.preview ?? id}
                    index={index}
                    name={file?.name ?? imageUrl.slice(-10)}
                    preview={file?.preview ?? imageUrl}
                    description={notes}
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
          <Input {...register('notes')} />
        </Box>

        {!donationData && (
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
        )}

        <TermsConditionModal onClose={onClose} onOpen={onOpen} isOpen={isOpen} />

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
  setDonationData: PropTypes.func,
  closeEditDonationModal: PropTypes.func,
};

DonationForm.defaultProps = {
  donationData: undefined,
  setDonationData: () => {},
  closeEditDonationModal: () => {},
};

export default DonationForm;

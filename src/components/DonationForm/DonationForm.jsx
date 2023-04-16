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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
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
import DonationImageModal from '../DonationImageModal/DonationImageModal';

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
    defaultValues: { ...donationData },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenImage, onOpen: onOpenImage, onClose: onCloseImage } = useDisclosure();
  const { isOpen: isOpenSubmit, onOpen: onOpenSubmit, onClose: onCloseSubmit } = useDisclosure();

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
    onCloseSubmit();
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
      status: APPROVAL_REQUESTED,
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
      navigate('/donate', {
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
      const newData = await updateDonation(donationData.id, {
        ...formData,
        status: APPROVAL_REQUESTED,
      });
      setDonationData(prev => ({ ...(newData ?? prev), status: APPROVAL_REQUESTED }));
      navigate(0);
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

  const [imageSelected, setImageSelected] = useState(0);
  const openImageModal = index => {
    const fileSelected = files[index];
    const image = {
      imageUrl: fileSelected.file.preview,
      notes: fileSelected.notes,
      fileName: fileSelected.file.path,
    };
    setImageSelected(image);
    onOpenImage();
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
    <form onSubmit={handleSubmit(() => onOpenSubmit())}>
      <Flex justifyContent="center" width="100%" flexDir="column" px={40} py={20}>
        <Box>
          <Heading fontSize="36px" fontWeight="700" color="blue.500" mb={5}>
            Patriots and Paws Donation Form
          </Heading>
          <Text>
            Fill out the form with your contact information, select the items you wish to donate,
            and upload pictures of the furniture to ensure that it&apos;s in good condition. After
            we receive and review your furniture donation form, we will reach out to you to schedule
            a pickup of the donated items. We thank you for your support!
          </Text>
        </Box>

        <Divider my={10} />

        <Box>
          <Flex columnGap={40}>
            <Box w="40%">
              <Heading fontSize="20px" mb={5}>
                Contact Information
              </Heading>
              <Text>
                Please enter your contact information. This information will be used to contact you
                about your donation and to schedule a pickup date. Please provide accurate and
                up-to-date information.
              </Text>
            </Box>
            <Box w="60%">
              <Flex columnGap={16} mb={10}>
                <FormControl isInvalid={errors && errors.firstName} w="50%">
                  <FormLabel>First Name</FormLabel>
                  <Input {...register('firstName')} />
                  <FormErrorMessage>
                    {errors.firstName && errors.firstName.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors && errors.lastName} w="50%">
                  <FormLabel>Last Name</FormLabel>
                  <Input {...register('lastName')} />
                  <FormErrorMessage>{errors.lastName && errors.lastName.message}</FormErrorMessage>
                </FormControl>
              </Flex>

              <Flex columnGap={16} mb={10}>
                <FormControl isInvalid={errors && errors.email} w="50%">
                  <FormLabel>Email Address </FormLabel>
                  <Input {...register('email')} disabled={donationData?.email} />
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors && errors.phoneNum} w="50%">
                  <FormLabel>Phone Number </FormLabel>
                  <Input type="tel" {...register('phoneNum')} />
                  <FormErrorMessage>{errors.phoneNum && errors.phoneNum.message}</FormErrorMessage>
                </FormControl>
              </Flex>

              <Flex rowGap={10} flexDir="column" mb={10}>
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
              </Flex>

              <Flex columnGap={16} mb={10}>
                <FormControl w="50%" isInvalid={errors && errors.addressCity}>
                  <FormLabel>City </FormLabel>
                  <Input {...register('addressCity')} />
                  <FormErrorMessage>
                    {errors.addressCity && errors.addressCity.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl w="20%">
                  <FormLabel>State</FormLabel>
                  <Input defaultValue="CA" isDisabled />
                </FormControl>

                <FormControl isInvalid={errors && errors.addressZip} w="30%">
                  <FormLabel>ZIP Code</FormLabel>
                  <Input {...register('addressZip')} />
                  <FormErrorMessage>
                    {errors.addressZip && errors.addressZip.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>

              <Flex>
                <FormControl>
                  <FormLabel>
                    {' '}
                    Special Instructions (e.g. gate code, specific directions){' '}
                  </FormLabel>
                  <Textarea />
                </FormControl>
              </Flex>
            </Box>
          </Flex>
        </Box>

        <Divider my={10} />

        <Box>
          <Flex columnGap={40}>
            <Box w="40%">
              <Flex alignItems="center" mb={5}>
                <Heading fontSize="20px" mr={3}>
                  Donate Items
                </Heading>
                <ItemInfo items={itemsInfoList} isAccepted />
              </Flex>
              <Text>Select which items you would like to donate and how many of each item.</Text>
            </Box>
            <Box w="60%">
              <FormControl isInvalid={errors && errors.Items}>
                <FormLabel mb={5}>Select Items</FormLabel>
                <Select
                  placeholder="Item List"
                  value={selectedFurnitureValue}
                  onChange={ev => addDonation(ev)}
                  marginBottom="1em"
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
              </FormControl>
              <DonationImageModal
                isOpenImageModal={isOpenImage}
                onCloseImageModal={onCloseImage}
                image={imageSelected}
              />
            </Box>
          </Flex>
        </Box>

        <Divider my={10} />

        <Box>
          <Flex columnGap={40}>
            <Box w="40%">
              <Heading fontSize="20px" mb={5}>
                Image Upload
              </Heading>
              <Text>
                Please upload images of all the furniture items you wish to donate with descriptions
                if needed. Maximum number of photos is 16.
              </Text>
            </Box>
            <Box w="60%">
              <DropZone files={files} setFiles={setFiles} maxFiles={16} />
              <Flex wrap="wrap" columnGap={5}>
                {files.map(({ file, id, imageUrl, notes }, index) => {
                  return (
                    <Box key={file?.preview ?? id}>
                      <ImageDetails
                        index={index}
                        name={file?.name ?? imageUrl.slice(-10)}
                        preview={file?.preview ?? imageUrl}
                        description={notes}
                        removeImage={removeFile}
                        updateDescription={updateDescription}
                        openImageModal={() => openImageModal(index)}
                      />
                    </Box>
                  );
                })}
              </Flex>
            </Box>
          </Flex>
        </Box>

        <Divider my={10} />

        <Box>
          <Flex columnGap={40}>
            <Box w="40%">
              <Heading fontSize="20px" mb={5}>
                Terms and Conditions
              </Heading>
              <Text>Please review and accept these terms before submitting the form.</Text>
            </Box>
            <Box w="60%">
              {!donationData && (
                <FormControl isInvalid={errors && errors.termsCond}>
                  <Flex>
                    <Checkbox {...register('termsCond')} />
                    <Text>&nbsp;&nbsp;I agree to the&nbsp;</Text>
                    <Text cursor="pointer" onClick={onOpen} as="u">
                      terms and conditions.
                    </Text>
                  </Flex>
                  <FormErrorMessage>
                    {errors.termsCond && errors.termsCond.message}
                  </FormErrorMessage>
                </FormControl>
              )}

              <TermsConditionModal onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
            </Box>
          </Flex>
        </Box>

        <Box>
          <AlertDialog isOpen={isOpenSubmit} onClose={onCloseSubmit}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Submit
                </AlertDialogHeader>
                <AlertDialogBody>Are you sure you would like to submit?</AlertDialogBody>
                <AlertDialogFooter>
                  <Button colorScheme="red" onClick={onCloseSubmit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit(data => onSubmit(data))} ml={3}>
                    Submit
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <Flex justifyContent="flex-end">
            <Button colorScheme="blue" type="submit">
              {!donationData ? 'Submit' : 'Save'}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </form>
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

import React, { useEffect, useRef, useState } from 'react';
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

const schema = {
  firstName: yup.string().required('Invalid first name'),
  lastName: yup.string().required('Invalid last name'),
  phoneNum: yup
    .string()
    .required('Phone number is required')
    .matches(/[0-9]{10}/, 'Phone number must be 10 digits'),
  addressStreet: yup.string().required('Street address is required'),
  addressCity: yup.string().required('City is required'),
  addressZip: yup
    .string()
    .required('ZIP Code is required')
    .matches(/^[0-9]{5}$/, 'ZIP Code must be a number and exactly 5 digits'),
  email: yup.string().email('Invalid email').required('Email required'),
};

function DonationForm({ donationData, setDonationData, closeEditDonationModal }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(
      yup.object({
        ...schema,
        ...(!donationData && {
          termsCond: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
        }),
      }),
    ),
    defaultValues: { ...donationData },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenImage, onOpen: onOpenImage, onClose: onCloseImage } = useDisclosure();
  const { isOpen: isOpenSubmit, onOpen: onOpenSubmit, onClose: onCloseSubmit } = useDisclosure();
  const { isOpen: isOpenCancel, onOpen: onOpenCancel, onClose: onCloseCancel } = useDisclosure();

  const navigate = useNavigate();
  const [furnitureOptions, setFurnitureOptions] = useState([]);

  const [donatedFurnitureList, setDonatedFurniture] = useState(donationData?.furniture ?? []);

  const [selectedFurnitureValue, setSelectedFurnitureValue] = useState('');

  const [files, setFiles] = useState(donationData?.pictures ?? []);

  const furnitureItemsDropdownRef = useRef(null);

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
    clearErrors('Items');
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
      imageUrl: fileSelected.file?.preview ?? fileSelected.imageUrl,
      notes: fileSelected.notes,
      fileName: fileSelected.file?.name ?? fileSelected.imageUrl.slice(-10),
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

  const validateData = () => {
    if (donatedFurnitureList.length < 1) {
      furnitureItemsDropdownRef.current.focus();
      setError('Items', {
        type: 'manual',
        message: 'A furniture selection is required',
      });
      return;
    }
    onOpenSubmit();
  };

  return (
    <>
      <form onSubmit={handleSubmit(() => validateData())}>
        <Flex
          justifyContent="center"
          width="100%"
          flexDir="column"
          px={{ base: 10, md: 40 }}
          py={{ base: 5, md: 20 }}
        >
          <Box>
            <Heading fontSize="36px" fontWeight="700" color="blue.500" mb={5}>
              Patriots and Paws Donation Form
            </Heading>
            <Text>
              Fill out the form with your contact information, select the items you wish to donate,
              and upload pictures of the furniture to ensure that it&apos;s in good condition. After
              we receive and review your furniture donation form, we will reach out to you to
              schedule a pickup of the donated items. We thank you for your support!
            </Text>
          </Box>

          <Divider my={10} />

          <Box display={{ md: 'flex' }}>
            <Box w={{ md: '40%' }} mr={{ md: 40 }}>
              <Heading fontSize="20px" mb={5}>
                Contact Information
              </Heading>
              <Text>
                Please enter your contact information. This information will be used to contact you
                about your donation and to schedule a pickup date. Please provide accurate and
                up-to-date information.
              </Text>
            </Box>
            <Box w={{ md: '60%' }} mt={{ base: 5, md: 0 }}>
              <Box display={{ md: 'flex' }} mb={10}>
                <FormControl
                  isInvalid={errors && errors.firstName}
                  w={{ md: '50%' }}
                  mr={{ md: 16 }}
                >
                  <FormLabel>
                    <Flex>
                      First Name&nbsp;<FormLabel color="red">*</FormLabel>
                    </Flex>
                  </FormLabel>
                  <Input {...register('firstName')} />
                  <FormErrorMessage>
                    {errors.firstName && errors.firstName.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={errors && errors.lastName}
                  w={{ md: '50%' }}
                  mt={{ base: 5, md: 0 }}
                >
                  <FormLabel>
                    <Flex>
                      Last Name&nbsp;<FormLabel color="red">*</FormLabel>
                    </Flex>
                  </FormLabel>
                  <Input {...register('lastName')} />
                  <FormErrorMessage>{errors.lastName && errors.lastName.message}</FormErrorMessage>
                </FormControl>
              </Box>

              <Box display={{ md: 'flex' }} mb={10}>
                <FormControl isInvalid={errors && errors.email} w={{ md: '50%' }} mr={{ md: 16 }}>
                  <FormLabel>
                    <Flex>
                      Email Address&nbsp;<FormLabel color="red">*</FormLabel>
                    </Flex>
                  </FormLabel>
                  <Input {...register('email')} disabled={donationData?.email} />
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={errors && errors.phoneNum}
                  mt={{ base: 5, md: 0 }}
                  w={{ md: '50%' }}
                >
                  <FormLabel>
                    <Flex>
                      Phone Number&nbsp;<FormLabel color="red">*</FormLabel>
                    </Flex>
                  </FormLabel>
                  <Input type="tel" {...register('phoneNum')} />
                  <FormErrorMessage>{errors.phoneNum && errors.phoneNum.message}</FormErrorMessage>
                </FormControl>
              </Box>

              <Flex rowGap={10} flexDir="column" mb={10}>
                <FormControl isInvalid={errors && errors.addressStreet}>
                  <FormLabel>
                    <Flex>
                      Street Address&nbsp;<FormLabel color="red">*</FormLabel>
                    </Flex>
                  </FormLabel>
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

              <Box display={{ md: 'flex' }} mb={10}>
                <FormControl
                  w={{ md: '50%' }}
                  isInvalid={errors && errors.addressCity}
                  mr={{ md: 16 }}
                >
                  <FormLabel>
                    <Flex>
                      City&nbsp;<FormLabel color="red">*</FormLabel>
                    </Flex>
                  </FormLabel>
                  <Input {...register('addressCity')} />
                  <FormErrorMessage>
                    {errors.addressCity && errors.addressCity.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl w={{ md: '20%' }} mr={{ md: 16 }} mt={{ md: 0, base: 5 }}>
                  <FormLabel>
                    <Flex>
                      State&nbsp;<FormLabel color="red">*</FormLabel>
                    </Flex>
                  </FormLabel>
                  <Input defaultValue="CA" isDisabled />
                </FormControl>

                <FormControl
                  isInvalid={errors && errors.addressZip}
                  w={{ md: '30%' }}
                  mt={{ md: 0, base: 5 }}
                >
                  <FormLabel>
                    <Flex>
                      Zip Code&nbsp;<FormLabel color="red">*</FormLabel>
                    </Flex>
                  </FormLabel>
                  <Input {...register('addressZip')} />
                  <FormErrorMessage>
                    {errors.addressZip && errors.addressZip.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              <Flex>
                <FormControl>
                  <FormLabel>
                    {' '}
                    Special Instructions (e.g. gate code, specific directions){' '}
                  </FormLabel>
                  <Textarea {...register('notes')} />
                </FormControl>
              </Flex>
            </Box>
          </Box>

          <Divider my={10} />

          <Box display={{ md: 'flex' }}>
            <Box w={{ md: '40%' }} mr={{ md: 40 }}>
              <Flex alignItems="center" mb={5}>
                <Heading fontSize="20px" mr={3}>
                  Donate Items
                </Heading>
                <ItemInfo items={itemsInfoList} isAccepted />
              </Flex>
              <Text>Select which items you would like to donate and how many of each item.</Text>
            </Box>
            <Box mt={{ base: 5, md: 0 }} w={{ md: '60%' }}>
              <FormControl isInvalid={errors && errors.Items}>
                <FormLabel>
                  <Flex>
                    Select Items&nbsp;<FormLabel color="red">*</FormLabel>
                  </Flex>
                </FormLabel>
                <Select
                  placeholder="Item List"
                  value={selectedFurnitureValue}
                  onChange={ev => addDonation(ev)}
                  marginBottom="1em"
                  ref={furnitureItemsDropdownRef}
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
                <FormErrorMessage>{errors.Items && errors.Items.message}</FormErrorMessage>
              </FormControl>
              <DonationImageModal
                isOpenImageModal={isOpenImage}
                onCloseImageModal={onCloseImage}
                image={imageSelected}
              />
            </Box>
          </Box>

          <Divider my={10} />

          <Box display={{ md: 'flex' }}>
            <Box w={{ md: '40%' }} mr={{ md: 40 }}>
              <Heading fontSize="20px" mb={5}>
                Image Upload
              </Heading>
              <Text>
                Please upload images of all the furniture items you wish to donate with descriptions
                if needed. Maximum number of photos is 16.
              </Text>
            </Box>
            <Box mt={{ base: 5, md: 0 }} w={{ md: '60%' }}>
              <DropZone setFiles={setFiles} maxFiles={16} />
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
          </Box>

          {!donationData ? (
            <>
              <Divider my={10} />
              <Box display={{ md: 'flex' }}>
                <Box w={{ md: '40%' }} mr={{ md: 40 }}>
                  <Heading fontSize="20px" mb={5}>
                    Terms and Conditions
                  </Heading>
                  <Text>Please review and accept these terms before submitting the form.</Text>
                </Box>
                <Box mt={{ base: 5, md: 0 }} w={{ md: '60%' }}>
                  <FormControl isInvalid={errors && errors.termsCond}>
                    <Flex>
                      <Checkbox {...register('termsCond')} verticalAlign="bottom" />
                      {/* <FormLabel mb={{ base: 5, md: 0 }}>
                      </FormLabel> */}
                      <Flex>
                        <Text>&nbsp;&nbsp;I agree to the&nbsp;</Text>
                        <Text cursor="pointer" onClick={onOpen} as="u">
                          terms and conditions.
                        </Text>
                        <Text color="red">&nbsp;*</Text>
                      </Flex>
                    </Flex>
                    <FormErrorMessage>
                      {errors.termsCond && errors.termsCond.message}
                    </FormErrorMessage>
                  </FormControl>

                  <TermsConditionModal onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
                </Box>
              </Box>
            </>
          ) : (
            <Box mb={10} />
          )}

          <Box>
            <AlertDialog isOpen={isOpenSubmit} onClose={onCloseSubmit}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Submit
                  </AlertDialogHeader>
                  <AlertDialogBody>Are you sure you would like to submit?</AlertDialogBody>
                  <AlertDialogFooter>
                    <Button colorScheme="gray" onClick={onCloseSubmit}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={handleSubmit(data => onSubmit(data))}
                      ml={3}
                    >
                      Submit
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>

            <AlertDialog isOpen={isOpenCancel} onClose={onCloseCancel}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Cancel
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you would like to exit? Your changes will not be saved.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button colorScheme="gray" onClick={onCloseCancel}>
                      Go Back
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        closeEditDonationModal();
                        onCloseCancel();
                      }}
                      ml={3}
                    >
                      Close
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>

            <Flex justifyContent={{ md: 'flex-end', base: 'center' }}>
              {donationData && (
                <Button mr={5} colorScheme="gray" onClick={onOpenCancel}>
                  Cancel
                </Button>
              )}
              <Button colorScheme="blue" type="submit">
                {!donationData ? 'Submit' : 'Save'}
              </Button>
            </Flex>
          </Box>
        </Flex>
      </form>
    </>
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

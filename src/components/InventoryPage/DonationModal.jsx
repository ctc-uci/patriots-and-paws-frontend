import React, { useState, useEffect } from 'react';

import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Flex,
  Text,
  Input,
  Stack,
  InputLeftAddon,
  InputRightAddon,
  InputGroup,
  Textarea,
  Modal,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';

import { useForm } from 'react-hook-form';
import { PropTypes } from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PNPBackend } from '../../utils/utils';
import { makeDate } from '../../utils/InventoryUtils';
import './InventoryPage.module.css';

const DonationModal = ({ data, onClose, isOpen, setUsers }) => {
  const dataCopy = data;
  const { id, submittedDate } = data;

  // const [image, setImage] = useState([]);

  // useEffect(async () => {
  // const result = await getPictureFromDB(id);
  // setImage(result[0]);
  // }, []);

  const schema = yup.object({
    firstName: yup.string().required('Invalid fist name'),
    lastName: yup.string().required('Invalid last name'),
    addressZip: yup
      .string()
      .length(5, 'Invalid zip code')
      .matches(/^\d{5}$/)
      .required('enter a zip'),
    email: yup.string().email('Invalid email').required('enter your email'),
    phoneNum: yup.number().typeError('Must be a number').required('Please enter a phone number'),
    addressStreet: yup.string(),
    addressUnit: yup.string().required('Must be a number'),
    addressCity: yup.string().required('Must be a valid city'),
    notes: yup.string(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: data, resolver: yupResolver(schema) });
  const [canEditInfo, setCanEditInfo] = useState(false);

  useEffect(() => {
    reset(data);
  }, [data]);

  const updateDonationStatus = async newstatus => {
    setUsers(prev => prev.map(ele => (ele.id === id ? { ...ele, status: newstatus } : ele)));
    await PNPBackend.put(`/donations/${id}`, {
      status: newstatus,
    });
  };

  const updateDonation = async e => {
    setUsers(prev => prev.map(ele => (ele.id === id ? { ...ele, ...e } : ele)));
    setCanEditInfo(false);
    onClose();
    await PNPBackend.put(`/donations/${id}`, e);
  };

  const close = () => {
    setCanEditInfo(false);
    onClose();
  };

  // function makeDate(dateDB) {
  //   const d = new Date(dateDB);
  //   return `${d.getMonth() + 1} ${d.getDate()}, ${d.getFullYear()}`;
  // }
  return (
    <Modal isOpen={isOpen} onClose={close} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader m={3}>
          <Text fontSize={36}>Donation #{id}</Text>
          <Text fontSize={16}>Submission Date: {makeDate(submittedDate)}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <Flex flexDirection="row" m={3}>
              <Box h={600} w="60%" m={5}>
                <Text mb={5} fontSize="20px">
                  Basic Information
                </Text>
                <Stack spacing={3}>
                  <FormControl isInvalid={errors && errors.firstName} width="47%">
                    <InputGroup>
                      <InputLeftAddon>Name</InputLeftAddon>
                      <Input
                        placeholder="name"
                        {...register('firstName')}
                        isRequired
                        isDisabled={!canEditInfo}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.firstName && errors.firstName.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
                <Stack direction="row" my={2}>
                  <InputGroup>
                    <InputLeftAddon>Email</InputLeftAddon>
                    <Input
                      placeholder="email"
                      {...register('email')}
                      isRequired
                      isDisabled={!canEditInfo}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                  <InputGroup>
                    <InputLeftAddon>Phone Number</InputLeftAddon>
                    <FormControl isInvalid={errors && errors.phoneNum}>
                      <Input
                        type="tel"
                        placeholder="phone number"
                        {...register('phoneNum')}
                        isRequired
                        isDisabled={!canEditInfo}
                      />
                      <FormErrorMessage>
                        {errors.phoneNum && errors.phoneNum.message}
                      </FormErrorMessage>
                    </FormControl>
                  </InputGroup>
                </Stack>
                <Text mt="60px" mb={5} fontSize="20px">
                  Address
                </Text>
                <Stack spacing={3} direction="row">
                  <InputGroup>
                    <InputLeftAddon>Street Address</InputLeftAddon>
                    <Input
                      placeholder="street"
                      {...register('addressStreet')}
                      isRequired
                      isDisabled={!canEditInfo}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.addressStreet && errors.addressStreet.message}
                  </FormErrorMessage>
                  <InputGroup>
                    <InputLeftAddon>Unit</InputLeftAddon>
                    <Input
                      placeholder="unit"
                      {...register('addressUnit')}
                      isRequired
                      isDisabled={!canEditInfo}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.addressUnit && errors.addressUnit.message}
                  </FormErrorMessage>
                </Stack>
                <Stack spacing={3} direction="row" my={2}>
                  <InputGroup>
                    <InputLeftAddon>City</InputLeftAddon>
                    <Input
                      placeholder="city"
                      {...register('addressCity')}
                      isRequired
                      isDisabled={!canEditInfo}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.addressCity && errors.addressCity.message}
                  </FormErrorMessage>
                  <InputGroup>
                    <InputLeftAddon>State</InputLeftAddon>
                    <Input placeholder="CA" isDisabled />
                  </InputGroup>
                  <FormErrorMessage>{errors.add && errors.state.message}</FormErrorMessage>
                  <InputGroup>
                    <InputLeftAddon>Zip Code</InputLeftAddon>
                    <FormControl isInvalid={errors && errors.addressZip}>
                      <Input
                        placeholder="zip"
                        {...register('addressZip')}
                        isRequired
                        isDisabled={!canEditInfo}
                      />
                      <FormErrorMessage>
                        {errors.addressZip && errors.addressZip.message}
                      </FormErrorMessage>
                    </FormControl>
                  </InputGroup>
                </Stack>
                <Text mt="60px" mb={5} fontSize="20px">
                  Additional Comments
                </Text>
                <Textarea
                  placeholder="Enter additional comments here"
                  {...register('notes')}
                  isDisabled={!canEditInfo}
                />
              </Box>

              <Box h={600} w="40%" m={5}>
                <Box>
                  <Text mb={5} fontSize="20px">
                    Images
                  </Text>
                  <Box h={300} w={395} bg="gray">
                    {/* {image ? image.imageUrl : 'no image provided'} */}
                  </Box>
                </Box>

                <Box h={400} w="70%">
                  <Text mt="45px" mb={5} fontSize="20px">
                    Furniture Items
                  </Text>
                  <Stack>
                    <InputGroup>
                      <Input value="Dining Table" />
                      {/* isDisabled={true}  */}
                      <InputRightAddon>2</InputRightAddon>
                    </InputGroup>

                    <InputGroup>
                      <Input value="Dining Table" />
                      {/* isDisabled={true}  */}

                      <InputRightAddon>2</InputRightAddon>
                    </InputGroup>

                    <InputGroup>
                      <Input value="Dining Table" />
                      {/* isDisabled={true}  */}

                      <InputRightAddon>2</InputRightAddon>
                    </InputGroup>

                    <InputGroup>
                      <Input value="Dining Table" />
                      {/* isDisabled={true}  */}

                      <InputRightAddon>2</InputRightAddon>
                    </InputGroup>
                  </Stack>
                </Box>
              </Box>
            </Flex>
          </form>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Box>
            <Button
              colorScheme="red"
              onClick={() => {
                updateDonationStatus('denied');
              }}
            >
              Reject
            </Button>
            <Button
              ml={3}
              colorScheme="gray"
              onClick={() => {
                updateDonationStatus('flagged');
              }}
            >
              Flag
            </Button>
            <Button
              ml={3}
              colorScheme="green"
              onClick={() => {
                updateDonationStatus('approved');
              }}
            >
              Approve
            </Button>
          </Box>
          <Box>
            {!canEditInfo ? (
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  setCanEditInfo(true);
                }}
              >
                Edit Information
              </Button>
            ) : (
              <>
                <Button
                  ml={3}
                  colorScheme="gray"
                  onClick={() => {
                    // close();
                    setCanEditInfo(false);
                    reset(dataCopy);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  ml={3}
                  colorScheme="blue"
                  onClick={handleSubmit(updateDonation)}
                  type="submit"
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

DonationModal.propTypes = {
  setUsers: PropTypes.func,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.string,
    addressStreet: PropTypes.string.isRequired,
    addressUnit: PropTypes.string.isRequired,
    addressCity: PropTypes.string.isRequired,
    addressZip: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNum: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    submittedDate: PropTypes.string.isRequired,
  }),
};

DonationModal.defaultProps = {
  data: {},
  isOpen: false,
  onClose: () => {},
  setUsers: () => {},
};

export default DonationModal;

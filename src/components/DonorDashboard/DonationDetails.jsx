import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tag,
  Box,
  Text,
  Flex,
  Divider,
  useDisclosure,
  Button,
  Image,
  Grid,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { PropTypes } from 'prop-types';
import DonationFurnitureContainer from '../InventoryPage/DonationFurnitureContainer';
import DonationImagesContainer from '../InventoryPage/DonationImagesContainer';
import EditDonationModal from '../EditDonationModal/EditDonationModal';
import { STATUSES } from '../../utils/config';
import { PNPBackend } from '../../utils/utils';
import pencilIcon from '../../assets/pencil.svg';
import grayPencilIcon from '../../assets/grayPencil.png';

const { PENDING, CHANGES_REQUESTED, PICKED_UP, APPROVAL_REQUESTED, RESCHEDULE } = STATUSES;

const DeleteDonationDialog = ({ isOpen, onClose, onSubmit }) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Donation
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>Are you sure you want to delete this form?</Text>
            <Text> You can’t undo this action afterwards. </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={onSubmit} ml={3}>
              Delete Form
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const displayStatusTag = status => {
  switch (status) {
    case PENDING:
    case APPROVAL_REQUESTED:
      return (
        <Tag variant="solid" colorScheme="blue">
          Submitted
        </Tag>
      );
    case CHANGES_REQUESTED:
      return (
        <Tag variant="solid" colorScheme="orange">
          Changes Needed
        </Tag>
      );
    case PICKED_UP:
      return (
        <Tag variant="solid" colorScheme="green">
          Received
        </Tag>
      );
    case RESCHEDULE:
      return (
        <Tag variant="solid" colorScheme="blue">
          Rescheduling
        </Tag>
      );
    default:
      return (
        <Tag variant="solid" colorScheme="green">
          Approved
        </Tag>
      );
  }
};

const DonationDetails = ({ data, setDonationData }) => {
  const { status, id, submittedDate, pictures, furniture } = data;

  const formatDate = date => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  const {
    isOpen: editModalIsOpen,
    onOpen: editModalOnOpen,
    onClose: editModalOnClose,
  } = useDisclosure();
  const {
    isOpen: deleteDialogIsOpen,
    onOpen: deleteDialogOnOpen,
    onClose: deleteDialogOnClose,
  } = useDisclosure();

  const navigate = useNavigate();
  const handleDelete = async () => {
    await PNPBackend.delete(`/donations/${id}`);
    deleteDialogOnClose();
    navigate('/donate', { state: {} });
    navigate(0);
  };

  return (
    <Flex direction="column" width="100%" height="100%">
      <Flex alignItems="center" justifyContent="space-between" pb={4}>
        <Flex display={{ base: 'flex', md: 'none' }} flexDir="column">
          <Text fontWeight={600} fontSize="16px" textAlign="left">
            Form #{id}
          </Text>
          <Text fontSize="12px">Submitted on {formatDate(submittedDate)}</Text>
        </Flex>
        <Box display={{ base: 'flex', md: 'none' }} gap={2} align="center">
          {status === CHANGES_REQUESTED && (
            <IconButton
              icon={<Image src={grayPencilIcon} w="100%" h="100%" />}
              onClick={editModalOnOpen}
              colorScheme="transparent"
              size="xs"
            />
          )}
          {status !== PICKED_UP && (
            <DeleteIcon
              color="red.500"
              _hover={{ cursor: 'pointer' }}
              onClick={deleteDialogOnOpen}
            />
          )}
        </Box>
        <Flex gap={5} display={{ base: 'none', md: 'flex' }}>
          <Box display={{ base: 'none', md: 'block' }}>{displayStatusTag(status)}</Box>
          <Text fontWeight={700} fontSize={{ base: '16px', md: '18px' }}>
            Form #{id}
          </Text>
        </Flex>
        <Box alignItems="center" gap={5} display={{ base: 'none', md: 'flex' }}>
          <Text fontSize="18px">Submitted on {formatDate(submittedDate)}</Text>
          {status === CHANGES_REQUESTED && (
            <Button onClick={editModalOnOpen} colorScheme="orange" justifyContent="center">
              <Text>Edit Form</Text>
              <Image src={pencilIcon} ml={2} />
            </Button>
          )}
          {status !== PICKED_UP && (
            <DeleteIcon
              color="red.500"
              _hover={{ cursor: 'pointer' }}
              onClick={deleteDialogOnOpen}
            />
          )}
        </Box>
      </Flex>
      <Divider size="md" variant="solid" />
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={5}
        height="100%"
        alignItems="center"
      >
        {pictures && <DonationImagesContainer pictures={pictures} itemsPerPage={1} />}
        {furniture && <DonationFurnitureContainer data={furniture} />}
      </Grid>
      <EditDonationModal
        donationData={data}
        setDonationData={setDonationData}
        isOpen={editModalIsOpen}
        onClose={editModalOnClose}
      />
      <DeleteDonationDialog
        isOpen={deleteDialogIsOpen}
        onClose={deleteDialogOnClose}
        onSubmit={handleDelete}
      />
    </Flex>
  );
};

DonationDetails.propTypes = {
  data: PropTypes.shape({
    status: PropTypes.string,
    id: PropTypes.string,
    addressStreet: PropTypes.string,
    addressUnit: PropTypes.string,
    addressCity: PropTypes.string,
    addressZip: PropTypes.number,
    firstName: PropTypes.string,
    furniture: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        count: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNum: PropTypes.string,
    notes: PropTypes.string,
    submittedDate: PropTypes.string,
    pickupDate: PropTypes.string,
    routeId: PropTypes.number,
    pictures: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        imageURL: PropTypes.string,
        notes: PropTypes.string,
      }),
    ),
  }).isRequired,
  setDonationData: PropTypes.func.isRequired,
};

DeleteDonationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export { DonationDetails, displayStatusTag };

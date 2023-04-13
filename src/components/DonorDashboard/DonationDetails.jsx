import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Tag,
  TagLabel,
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
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { PropTypes } from 'prop-types';
import DonationFurnitureContainer from '../InventoryPage/DonationFurnitureContainer';
import DonationImagesContainer from '../InventoryPage/DonationImagesContainer';
import EditDonationModal from '../EditDonationModal/EditDonationModal';
import { STATUSES } from '../../utils/config';
import { PNPBackend } from '../../utils/utils';
import pencilIcon from '../../assets/pencil.svg';
// import { PNPBackend } from '../../utils/utils';

const {
  PENDING,
  // SCHEDULING,
  // SCHEDULED,
  CHANGES_REQUESTED,
  PICKED_UP,
  APPROVAL_REQUESTED,
  // RESCHEDULE,
} = STATUSES;

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

const DonationDetails = ({ data, setDonationData, setDonationStatus }) => {
  const { status, id, submittedDate, pictures, furniture } = data;

  console.log(data);
  console.log(pictures);
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

  const displayStatusTag = () => {
    if (status === PENDING || status === APPROVAL_REQUESTED) {
      return (
        <Tag variant="solid" colorScheme="blue">
          Submitted
        </Tag>
      );
    }
    if (status === CHANGES_REQUESTED) {
      return (
        <Tag bg="orange.100">
          <TagLabel color="orange.600"> Changes Needed </TagLabel>
        </Tag>
      );
    }
    if (status === PICKED_UP) {
      return (
        <Tag variant="solid" colorScheme="green">
          Received
        </Tag>
      );
    }
    return (
      <Tag variant="solid" colorScheme="green">
        Approved
      </Tag>
    );
  };

  const editButton = (
    <Button size="sm" onClick={editModalOnOpen} colorScheme="orange">
      Edit Form <Image src={pencilIcon} ml={2} />
    </Button>
  );

  const navigate = useNavigate();
  const handleDelete = async () => {
    await PNPBackend.delete(`/donations/${id}`);
    deleteDialogOnClose();
    navigate('/donate', { state: {} });
    navigate(0);
  };

  return (
    <>
      <Flex direction="column">
        <Flex alignItems="center" justifyContent="space-between" px={3} pb={4}>
          <Flex gap={5}>
            {displayStatusTag()}
            <Text fontWeight={700}>Form #{id}</Text>
          </Flex>
          <Flex alignItems="center" gap={5}>
            <Text>Submitted on {formatDate(submittedDate)}</Text>
            {status === CHANGES_REQUESTED && editButton}
            {status !== PICKED_UP && (
              <DeleteIcon
                color="red.500"
                _hover={{ cursor: 'pointer' }}
                onClick={deleteDialogOnOpen}
              />
            )}
          </Flex>
        </Flex>
        <Divider size="md" variant="solid" />
        <Grid templateColumns="1fr 1fr" alignItems="center" gap={5}>
          <Box borderRadius="6px">
            {pictures && <DonationImagesContainer pictures={pictures} />}
          </Box>
          <Box maxH="sm">{furniture && <DonationFurnitureContainer data={furniture} />}</Box>
        </Grid>
      </Flex>
      <EditDonationModal
        donationData={data}
        setDonationData={setDonationData}
        isOpen={editModalIsOpen}
        onClose={editModalOnClose}
        setDonationStatus={setDonationStatus}
      />
      <DeleteDonationDialog
        isOpen={deleteDialogIsOpen}
        onClose={deleteDialogOnClose}
        onSubmit={handleDelete}
      />
    </>
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
  setDonationStatus: PropTypes.func.isRequired,
};

DeleteDonationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DonationDetails;

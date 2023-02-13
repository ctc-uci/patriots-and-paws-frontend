import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Flex,
  Icon,
  List,
  ListItem,
  Box,
  Text,
  HStack,
  Button,
  Stack,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  Heading,
} from '@chakra-ui/react';
import { Reorder } from 'framer-motion';
import { getDonations, updateDonation } from '../../utils/RouteUtils';

const EditRouteModal = ({ routeId, routeDate, isOpen, onClose }) => {
  const [donations, setDonations] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  const fetchDonations = async () => {
    const donationsFromDB = await getDonations(routeId);
    setDonations(donationsFromDB);
  };

  useEffect(() => {
    if (routeId) {
      fetchDonations();
    }
  }, [routeId]);

  // create red circle icon
  const CircleIcon = props => (
    <Icon viewBox="0 0 200 200" {...props}>
      <path fill="currentColor" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" />
    </Icon>
  );

  const handleSave = async () => {
    try {
      const updatedDonations = donations.map((donation, index) =>
        Object.assign(donation, { orderNum: index + 1 }),
      );
      const updateDonationPromises = updatedDonations.map(donation => updateDonation(donation));
      await Promise.all(updateDonationPromises);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const convertDate = date => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  };

  const handleCancel = () => {
    setDonations([]);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} scrollBehavior="outside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading paddingLeft={2} paddingTop={2}>
            Route #{routeId}
          </Heading>
          <Text paddingLeft={2} fontSize="md" fontWeight="normal">
            {convertDate(routeDate)}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack p={2}>
            <List
              style={{ borderLeft: '1px solid black' }}
              as={Reorder.Group}
              spacing={2}
              axis="y"
              values={donations}
              onReorder={setDonations}
            >
              {donations.map(donation => (
                <ListItem
                  margin="0"
                  padding="0"
                  as={Reorder.Item}
                  key={donation.orderNum}
                  value={donation}
                  dragTransition={{
                    bounceStiffness: 600,
                  }}
                  initial="notDragging"
                  whileDrag="dragging"
                  position="relative"
                  cursor="move"
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <CircleIcon margin={-2} boxSize={4} color="#fc8181" />
                    <Box
                      marginLeft={5}
                      backgroundColor="white"
                      border="solid"
                      borderWidth={1}
                      borderColor="black"
                      p={5}
                      fontSize={16}
                      width="500px"
                    >
                      <Flex justifyContent="space-between">
                        <Text>Donation #{donation.id}</Text>
                        <Text>
                          {donation.firstName} {donation.lastName}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Stack>
          <Box>{errorMessage}</Box>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="center" alignItems="center" width="100%" spacing={5}>
            <Button colorScheme="gray" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" onClick={handleSave}>
              Save changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

EditRouteModal.propTypes = {
  routeId: PropTypes.string,
  routeDate: PropTypes.instanceOf(Date),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

EditRouteModal.defaultProps = {
  routeId: '',
  routeDate: new Date(),
};

export default EditRouteModal;

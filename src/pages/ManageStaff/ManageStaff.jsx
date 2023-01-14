import React from 'react';
import {
  ListItem,
  List,
  Flex,
  Text,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';
import { StarIcon, HamburgerIcon } from '@chakra-ui/icons';
import styles from './ManageStaff.css';
import CreateAccount from '../../components/CreateAccount/CreateAccount';
import profilePicture from '../../assets/profilePicture.png';
import DisplayedProfile from '../../components/DisplayedProfile/DisplayedProfile';

const ManageStaff = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const firstNames = ['Manny', 'John', 'Mary', 'Lisa'];
  const lastNames = ['Jacinto', 'Paul', 'Ann', 'Walter'];
  const roles = ['Driver', 'Admin', 'Driver', 'Admin'];

  return (
    <Flex className="side-panel">
      <Flex className={styles['panel-title']} align="center">
        <StarIcon />
        <Text className="staff-title" ml={2}>
          Staff
        </Text>
        <HamburgerIcon ml="240px" />
      </Flex>
      <Flex minH="100vh">
        <List className="panel">
          {firstNames.map((name, index) => (
            <ListItem key={name} mb={0} mt={0} border="1px" borderColor="gray.200">
              <Flex align="center" height="12vh" mr={20} ml={10}>
                <Image ml={5} boxSize="50px" src={profilePicture} mr="4vh" />
                <Flex className="driver-info">
                  <Text className="driver-name">
                    {name} {lastNames[index]}
                  </Text>
                  <Text className="role">{roles[index]}</Text>
                </Flex>
              </Flex>
            </ListItem>
          ))}
          <Button colorScheme="blue" className={styles['create-account-button']} onClick={onOpen}>
            Create User
          </Button>
        </List>
        <DisplayedProfile />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <CreateAccount />
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
};

export default ManageStaff;

import React from 'react';
import {
  Flex,
  Text,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Tag,
  InputGroup,
  InputLeftElement,
  Input,
  TagCloseButton,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  EditIcon,
  EmailIcon,
  PhoneIcon,
  SearchIcon,
  SmallAddIcon,
} from '@chakra-ui/icons';
import styles from './ManageStaff.css';
import CreateAccount from '../../components/CreateAccount/CreateAccount';
import cardAccount from '../../assets/card-account-details.png';
import nameIcon from '../../assets/Bold.png';
import menuIcon from '../../assets/Sort.png';

const ManageStaff = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const names = ['Manny Jacinto', 'John Paul', 'Mary Ann', 'Lisa Walter'];
  const emails = [
    'ncarson@gmail.com',
    'ncarson@gmail.com',
    'ncarson@gmail.com',
    'ncarson@gmail.com',
  ];
  const phones = ['818-293-9998', '818-293-9998', '818-293-9998', '818-293-9998'];
  const roles = ['Driver', 'Admin', 'Driver', 'Admin'];

  return (
    <Flex className="column" direction="column">
      <Flex className="row">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Search Staff" style={{ width: '500px' }} />
        </InputGroup>
        <Tag size="sm" variant="solid" colorScheme="blue">
          Admin
          <TagCloseButton />
        </Tag>
        <Image src={menuIcon} style={{ width: '20px', height: '20px' }} />
        <Button colorScheme="blue" className={styles['create-account-button']} onClick={onOpen}>
          Add Staff <SmallAddIcon />
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <CreateAccount />
          </ModalContent>
        </Modal>
      </Flex>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>
                <Flex>
                  <Image src={nameIcon} mr={2} />
                  <Text>Name</Text>
                </Flex>
              </Th>
              <Th align="center">
                <EmailIcon mr={2} />
                Email Address
              </Th>
              <Th>
                <PhoneIcon mr={2} />
                Phone Number
              </Th>
              <Th>
                <Flex>
                  <Image src={cardAccount} mr={2} />
                  Role
                </Flex>
              </Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {names.map((name, index) => (
              <Tr key="{name}">
                <Td>{name}</Td>
                <Td>{emails[index]}</Td>
                <Td>{phones[index]}</Td>
                <Td>
                  {roles[index] === 'Admin' ? (
                    <Tag size="sm" variant="solid" colorScheme="blue">
                      Admin
                    </Tag>
                  ) : (
                    <Tag size="sm" variant="solid" colorScheme="red">
                      Driver
                    </Tag>
                  )}
                </Td>
                <Td>
                  <EditIcon mr={5} />
                  <DeleteIcon />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default ManageStaff;

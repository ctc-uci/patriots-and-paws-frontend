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
import cardAccount from '../../assets/card-account-details.svg';
import peopleIcon from '../../assets/Bold.svg';
import menuIcon from '../../assets/Menu.svg';

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
    <Flex className="column" direction="column" m={10}>
      <Flex mb={10} justify="space-between">
        <Flex>
          <InputGroup mr={5} width={200}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Search Staff" style={{ width: '200px' }} />
          </InputGroup>
          <Tag variant="solid" colorScheme="blue" font="Inter" size="sm" fontSize={18} ml={0}>
            Admin
            <TagCloseButton />
          </Tag>
        </Flex>
        <Flex>
          <Image
            src={menuIcon}
            style={({ width: '40%' }, { height: '40%' }, { float: 'right' })}
            mr={5}
          />
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
      </Flex>
      <TableContainer border="1px" borderColor="gray.200">
        <Table variant="striped" colorScheme="gray">
          <Thead bgColor="rgb(247,250,252)">
            <Tr className={styles['table-header']}>
              <Th>
                <Flex align="center">
                  <Image src={peopleIcon} mr={2} color="black" />
                  <Text color="black">Name</Text>
                </Flex>
              </Th>
              <Th>
                <Flex align="center">
                  <EmailIcon mr={2} color="black" />
                  <Text color="black">Email Address</Text>
                </Flex>
              </Th>
              <Th>
                <Flex align="center">
                  <PhoneIcon mr={2} color="black" />
                  <Text color="black">Phone Number</Text>
                </Flex>
              </Th>
              <Th>
                <Flex>
                  <Image src={cardAccount} mr={2} />
                  <Text color="black">Role</Text>
                </Flex>
              </Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody className={styles['row-text']}>
            {names.map((name, index) => (
              <Tr key="{name}">
                <Td>{name}</Td>
                <Td>{emails[index]}</Td>
                <Td>{phones[index]}</Td>
                <Td>
                  {roles[index] === 'Admin' ? (
                    <Tag size="sm" variant="solid" colorScheme="blue" font="Inter" fontSize="14px">
                      Admin
                    </Tag>
                  ) : (
                    <Tag size="sm" variant="solid" colorScheme="red" font="Inter" fontSize="14px">
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

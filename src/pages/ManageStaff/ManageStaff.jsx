import React, { useEffect, useState } from 'react';
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  EditIcon,
  EmailIcon,
  PhoneIcon,
  SearchIcon,
  SmallAddIcon,
} from '@chakra-ui/icons';
import { PNPBackend } from '../../utils/utils';
import styles from './ManageStaff.css';
import CreateAccount from '../../components/CreateAccount/CreateAccount';
import cardAccount from '../../assets/card-account-details.svg';
import peopleIcon from '../../assets/Bold.svg';
import menuIcon from '../../assets/Menu.svg';

const ManageStaff = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    const { data } = await PNPBackend.get('/users');
    setUsers(data);
  }, []);

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
          <Menu width="40%">
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={
                <Image
                  src={menuIcon}
                  style={({ width: '40%' }, { height: '40%' }, { float: 'right' })}
                />
              }
            />
            <MenuList>
              <MenuItem>Admin</MenuItem>
              <MenuItem>Driver</MenuItem>
            </MenuList>
          </Menu>
          <Button
            ml={5}
            colorScheme="blue"
            className={styles['create-account-button']}
            onClick={onOpen}
          >
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
            {users.map(user => (
              <Tr key="{name}">
                <Td>
                  {user.firstName} {user.lastName}
                </Td>
                <Td>{user.email}</Td>
                <Td>{user.phoneNumber}</Td>
                <Td>
                  {user.role === 'admin' ? (
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

import React, { useEffect, useState } from 'react';
import { instanceOf } from 'prop-types';
import {
  Flex,
  Text,
  Image,
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
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { EmailIcon, PhoneIcon, SearchIcon, SmallAddIcon } from '@chakra-ui/icons';
import { PNPBackend } from '../../utils/utils';
import styles from './ManageStaff.css';
import CreateAccount from '../../components/CreateAccount/CreateAccount';
import DeleteAccountModal from '../../components/DeleteAccountModal/DeleteAccountModal';
import cardAccount from '../../assets/card-account-details.svg';
import peopleIcon from '../../assets/Bold.svg';
import menuIcon from '../../assets/Menu.svg';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import AUTH_ROLES from '../../utils/AuthConfig';
import EditAccountModal from '../../components/EditAccountModal/EditAccountModal';

const { SUPERADMIN_ROLE } = AUTH_ROLES.AUTH_ROLES;

const ManageStaff = ({ cookies }) => {
  // const [role, setRole] = useState(ADMIN_ROLE);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [usersCopy, setUsersCopy] = useState([]);
  // Change below to false and driver
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);
  const [userType, setUserType] = useState('Staff');

  useEffect(async () => {
    const checkIsSuperAdmin = () => {
      const currentUserRole = cookies.get(cookieKeys.ROLE);
      if (currentUserRole === SUPERADMIN_ROLE) {
        setIsSuperAdmin(true);
        setUserType('Staff');
      }
    };
    await checkIsSuperAdmin();

    const { data } = await PNPBackend.get('/users');
    if (isSuperAdmin) {
      setUsers(data);
    } else {
      setUsers(data.filter(d => d.role === 'driver'));
    }
    await setUsersCopy(data);
  }, []);

  const getAdmins = () => {
    const adminData = usersCopy.filter(user => user.role === 'admin' || user.role === 'superadmin');
    setUsers(adminData);
  };

  const getDrivers = () => {
    const driverData = usersCopy.filter(user => user.role === 'driver');
    setUsers(driverData);
  };

  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  const handleInput = value => {
    return value.replace(phoneRegex, '$1-$2-$3');
  };

  return (
    <Flex className="column" direction="column" m={10}>
      <Flex mb={10} justify="space-between">
        <Flex>
          <InputGroup mr={5} width={300}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            {isSuperAdmin ? (
              <Input placeholder="Search Staff" style={{ width: '300px' }} />
            ) : (
              <Input placeholder="Search Drivers" style={{ width: '300px' }} />
            )}
          </InputGroup>
          {isSuperAdmin ? (
            <Tag variant="solid" colorScheme="blue" font="Inter" size="sm" fontSize={18} ml={0}>
              Admin
              <TagCloseButton />
            </Tag>
          ) : null}
        </Flex>
        <Flex>
          {isSuperAdmin ? (
            <Menu w="20px">
              <MenuButton
                as={IconButton}
                aria-label="Options"
                variant="ghost"
                icon={<Image src={menuIcon} />}
              />
              <MenuList>
                <MenuItem onClick={getAdmins}>Admin</MenuItem>
                <MenuItem onClick={getDrivers}>Driver</MenuItem>
              </MenuList>
            </Menu>
          ) : null}
          <Button
            ml={5}
            colorScheme="blue"
            className={styles['create-account-button']}
            onClick={onOpen}
          >
            Add {userType} <SmallAddIcon />
          </Button>
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <CreateAccount memberType={userType} />
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
              {isSuperAdmin ? (
                <Th>
                  <Flex>
                    <Image src={cardAccount} mr={2} />
                    <Text color="black">Role</Text>
                  </Flex>
                </Th>
              ) : null}
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
                <Td>{handleInput(user.phoneNumber)}</Td>
                {isSuperAdmin ? (
                  <Td>
                    {user.role === 'admin' || user.role === 'superadmin' ? (
                      <Tag
                        size="sm"
                        variant="solid"
                        colorScheme="blue"
                        font="Inter"
                        fontSize="14px"
                      >
                        Admin
                      </Tag>
                    ) : (
                      <Tag size="sm" variant="solid" colorScheme="red" font="Inter" fontSize="14px">
                        Driver
                      </Tag>
                    )}
                  </Td>
                ) : null}
                <Td>
                  <EditAccountModal mr={5} memberType={userType} />
                  {isSuperAdmin ? <DeleteAccountModal /> : null}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

ManageStaff.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ManageStaff);

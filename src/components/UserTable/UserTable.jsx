import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Flex,
  Image,
  Text,
  Tbody,
  Tag,
  Td,
  useDisclosure,
  Icon,
  HStack,
  TableCaption,
} from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons';
import { MdDelete, MdEdit, MdEmail } from 'react-icons/md';
import { formatPhone } from '../../utils/utils';
import EditAccountModal from '../EditAccountModal/EditAccountModal';
import DeleteAccountModal from '../DeleteAccountModal/DeleteAccountModal';
import peopleIcon from '../../assets/Bold.svg';
import cardAccount from '../../assets/card-account-details.svg';
import { AUTH_ROLES } from '../../utils/config';

const { SUPERADMIN_ROLE, ADMIN_ROLE } = AUTH_ROLES;

const UserTable = ({
  isSuperAdmin,
  users,
  setAllUsers,
  setDriverUsers,
  setAdminUsers,
  updateDisplay,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();
  const [editUserData, setEditUserData] = useState({});
  const [deleteUserData, setDeleteUserData] = useState({});

  const openEdit = data => {
    setEditUserData(data);
    onOpen();
  };

  const openDelete = data => {
    setDeleteUserData(data);
    deleteOnOpen();
  };
  return (
    <>
      <TableContainer border="1px" borderColor="gray.200" overflowY="auto" height="70vh">
        <Table variant="striped" colorScheme="gray">
          <Thead bgColor="gray.50" position="sticky" top={0}>
            <Tr>
              <Th w={isSuperAdmin ? '25%' : '33.3%'}>
                <Flex align="center">
                  <Image src={peopleIcon} mr="8px" />
                  <Text color="blackAlpha.700" fontSize="15px" fontWeight={700} lineHeight="16px">
                    Name
                  </Text>
                </Flex>
              </Th>
              <Th w={isSuperAdmin ? '25%' : '33.3%'}>
                <Flex align="center">
                  <Icon as={MdEmail} color="black" boxSize="16px" mr="8px" />
                  <Text color="blackAlpha.700" fontSize="15px" fontWeight={700} lineHeight="16px">
                    Email Address
                  </Text>
                </Flex>
              </Th>
              <Th w={isSuperAdmin ? '25%' : '16.65%'}>
                <Flex align="center">
                  <PhoneIcon color="black" mr="8px" />
                  <Text color="blackAlpha.700" fontSize="15px" fontWeight={700} lineHeight="16px">
                    Phone Number
                  </Text>
                </Flex>
              </Th>
              {isSuperAdmin && (
                <Th w="12.5%">
                  <Flex>
                    <Image src={cardAccount} mr="8px" />
                    <Text color="blackAlpha.700" fontSize="15px" fontWeight={700} lineHeight="16px">
                      Role
                    </Text>
                  </Flex>
                </Th>
              )}
              <TableCaption w={isSuperAdmin ? '12.5%' : '16.65%'} />
            </Tr>
          </Thead>
          <Tbody>
            {users?.map(user => (
              <Tr key={`${user.email}`}>
                <Td>
                  {user.firstName} {user.lastName}
                </Td>
                <Td>{user.email}</Td>
                <Td>{formatPhone(user.phoneNumber)}</Td>
                {isSuperAdmin && (
                  <Td>
                    {user.role === ADMIN_ROLE || user.role === SUPERADMIN_ROLE ? (
                      <Tag
                        size="sm"
                        variant="solid"
                        bgColor="blue.400"
                        font="Inter"
                        fontSize="18px"
                        lineHeight="27px"
                        p="1.5px 7.5px 1.5px 7.5px"
                      >
                        Admin
                      </Tag>
                    ) : (
                      <Tag
                        size="sm"
                        variant="solid"
                        bgColor="teal.500"
                        font="Inter"
                        fontSize="18px"
                        lineHeight="27px"
                        p="1.5px 7.5px 1.5px 7.5px"
                      >
                        Driver
                      </Tag>
                    )}
                  </Td>
                )}
                <Td>
                  <HStack gap="30px" justifyContent="flex-end">
                    <Icon
                      as={MdEdit}
                      onClick={() => openEdit(user)}
                      color="blackAlpha.700"
                      boxSize={30}
                    />
                    {isSuperAdmin && (
                      <Icon
                        as={MdDelete}
                        onClick={() => openDelete(user)}
                        color="red.500"
                        boxSize={30}
                      />
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <EditAccountModal
        mr={5}
        isSuperAdmin={isSuperAdmin}
        data={editUserData}
        onClose={onClose}
        isOpen={isOpen}
        setUsers={setAllUsers}
        setAdminUsers={setAdminUsers}
        setDriverUsers={setDriverUsers}
        updateDisplay={updateDisplay}
      />
      {isSuperAdmin && (
        <DeleteAccountModal
          staffProfile={deleteUserData}
          onClose={deleteOnClose}
          isOpen={deleteIsOpen}
          setAllUsers={setAllUsers}
          setAdminUsers={setAdminUsers}
          setDriverUsers={setDriverUsers}
        />
      )}
    </>
  );
};

UserTable.propTypes = {
  isSuperAdmin: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      id: PropTypes.string,
      lastName: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }),
  ),
  setAllUsers: PropTypes.func.isRequired,
  setDriverUsers: PropTypes.func.isRequired,
  setAdminUsers: PropTypes.func.isRequired,
  updateDisplay: PropTypes.func.isRequired,
};

UserTable.defaultProps = {
  users: [],
};

export default UserTable;

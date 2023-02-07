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
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { EmailIcon, PhoneIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { formatPhone } from '../../utils/utils';
import styles from './UserTable.module.css';
import EditAccountModal from '../EditAccountModal/EditAccountModal';
import DeleteAccountModal from '../DeleteAccountModal/DeleteAccountModal';
import peopleIcon from '../../assets/Bold.svg';
import cardAccount from '../../assets/card-account-details.svg';
import AUTH_ROLES from '../../utils/AuthConfig';

const { SUPERADMIN_ROLE, ADMIN_ROLE } = AUTH_ROLES.AUTH_ROLES;

const UserTable = ({ isSuperAdmin, users, setUsers }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();
  const [editUserData, setEditUserData] = useState([]);
  const [deleteUserData, setDeleteUserData] = useState([]);

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
              <Tr key={`${user.id}`}>
                <Td>
                  {user.firstName} {user.lastName}
                </Td>
                <Td>{user.email}</Td>
                <Td>{formatPhone(user.phoneNumber)}</Td>
                {isSuperAdmin ? (
                  <Td>
                    {user.role === ADMIN_ROLE || user.role === SUPERADMIN_ROLE ? (
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
                  <IconButton onClick={() => openEdit(user)} icon={<EditIcon />} variant="ghost" />
                  {isSuperAdmin ? (
                    <IconButton
                      onClick={() => openDelete(user)}
                      icon={<DeleteIcon />}
                      variant="ghost"
                    />
                  ) : null}
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
        users={users}
        setUsers={setUsers}
      />
      {isSuperAdmin ? (
        <DeleteAccountModal
          staffProfile={deleteUserData}
          onClose={deleteOnClose}
          isOpen={deleteIsOpen}
          users={users}
          setUsers={setUsers}
        />
      ) : null}
    </>
  );
};

UserTable.propTypes = {
  isSuperAdmin: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setUsers: PropTypes.func.isRequired,
};

export default UserTable;

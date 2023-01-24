import React from 'react';
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
} from '@chakra-ui/react';
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons';
import styles from './UserTable.module.css';
import EditAccountModal from '../EditAccountModal/EditAccountModal';
import DeleteAccountModal from '../DeleteAccountModal/DeleteAccountModal';
import peopleIcon from '../../assets/Bold.svg';
import cardAccount from '../../assets/card-account-details.svg';

const UserTable = ({ isSuperAdmin, memberType, users }) => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  const formatPhone = value => {
    return value.replace(phoneRegex, '$1-$2-$3');
  };

  return (
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
                  {user.role === 'admin' || user.role === 'superadmin' ? (
                    <Tag size="sm" variant="solid" colorScheme="blue" font="Inter" fontSize="14px">
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
                <EditAccountModal
                  mr={5}
                  isSuperAdmin={isSuperAdmin}
                  memberType={memberType}
                  userProfile={user}
                />
                {isSuperAdmin ? <DeleteAccountModal /> : null}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

UserTable.propTypes = {
  isSuperAdmin: PropTypes.bool.isRequired,
  memberType: PropTypes.string.isRequired,
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
};

export default UserTable;

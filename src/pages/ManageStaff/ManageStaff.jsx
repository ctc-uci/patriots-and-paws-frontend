import React, { useEffect, useState } from 'react';
import { instanceOf } from 'prop-types';
import {
  Flex,
  Image,
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuDivider,
  Tag,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Fuse from 'fuse.js';
import { PNPBackend } from '../../utils/utils';
import { getCurrentUserId } from '../../utils/AuthUtils';
import styles from './ManageStaff.css';
import CreateAccount from '../../components/CreateAccount/CreateAccount';
import menuIcon from '../../assets/Menu.svg';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import { AUTH_ROLES } from '../../utils/config';
import UserTable from '../../components/UserTable/UserTable';

const { SUPERADMIN_ROLE, DRIVER_ROLE, ADMIN_ROLE } = AUTH_ROLES;

const ManageStaff = ({ cookies }) => {
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [driverUsers, setDriverUsers] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [currFilter, setCurrFilter] = useState('all');

  const fuse = new Fuse(allUsers, {
    keys: ['firstName', 'lastName', 'email'],
  });

  const updateDisplay = () => {
    if (currFilter === 'all') {
      setDisplayedUsers(allUsers);
      fuse.setCollection(allUsers);
    } else if (currFilter === 'admin') {
      setDisplayedUsers(adminUsers);
      fuse.setCollection(adminUsers);
    } else {
      setDisplayedUsers(driverUsers);
      fuse.setCollection(driverUsers);
    }
  };

  const refreshData = async () => {
    const userId = getCurrentUserId();
    const currentUserRole = await cookies.get(cookieKeys.ROLE);
    const { data } = await PNPBackend.get('/users');

    if (currentUserRole === SUPERADMIN_ROLE) {
      setIsSuperAdmin(true);
      setAllUsers(data.filter(user => user.id !== userId));
      const driverData = data.filter(d => d.role === DRIVER_ROLE);
      setDriverUsers(driverData);
      const adminData = data.filter(
        d => (d.role === ADMIN_ROLE || d.role === SUPERADMIN_ROLE) && d.id !== userId,
      );
      setAdminUsers(adminData);
      setDisplayedUsers(data.filter(user => user.id !== userId));
    } else {
      const driverData = data.filter(d => d.role === DRIVER_ROLE);
      setAllUsers(driverData);
      setDriverUsers(driverData);
      setDisplayedUsers(driverData);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const search = async query => {
    if (query.target.value === '') {
      updateDisplay();
    } else {
      if (currFilter === 'all') {
        fuse.setCollection(allUsers);
      } else if (currFilter === 'admin') {
        fuse.setCollection(adminUsers);
      } else {
        fuse.setCollection(driverUsers);
      }
      const result = fuse.search(query.target.value);
      const filteredResults = result.map(user => user.item);
      setDisplayedUsers(filteredResults);
    }
  };

  useEffect(() => {
    updateDisplay();
  }, [currFilter, allUsers, driverUsers, adminUsers]);

  return (
    <Flex direction="column" m={10}>
      <Flex mb={10} justify="space-between" vertical-align="center">
        <Flex verticalAlign="bottom">
          <InputGroup mr={5} width={300}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Search Staff" className={styles['search-bar']} onChange={search} />
          </InputGroup>
          {isSuperAdmin && currFilter === 'admin' && (
            <Tag colorScheme="blue">
              <TagLabel fontSize={18} fontWeight={600} color="black">
                Admin
              </TagLabel>
              <TagCloseButton onClick={() => setCurrFilter('all')} />
            </Tag>
          )}
          {isSuperAdmin && currFilter === 'driver' && (
            <Tag colorScheme="blue">
              <TagLabel fontSize={18} fontWeight={600} color="black">
                Driver
              </TagLabel>
              <TagCloseButton onClick={() => setCurrFilter('all')} />
            </Tag>
          )}
        </Flex>
        {isSuperAdmin && (
          <Flex vertical-align="center">
            <Menu minW={0} w="20px">
              <Flex vertical-align="center" align="center">
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  variant="ghost"
                  icon={<Image src={menuIcon} />}
                />
                <MenuList
                  align="center"
                  minW={0}
                  width="65px"
                  height="80px"
                  bgColor="rgb(246, 246, 246)"
                >
                  <MenuItem
                    onClick={() => setCurrFilter('admin')}
                    fontSize={15}
                    minH={0}
                    height="30px"
                    mt={0}
                  >
                    Admin
                  </MenuItem>
                  <MenuDivider borderColor="gray" mb={1} mt={1} />
                  <MenuItem
                    onClick={() => setCurrFilter('driver')}
                    fontSize={15}
                    minH={0}
                    height="30px"
                  >
                    Driver
                  </MenuItem>
                </MenuList>
              </Flex>
            </Menu>
            <CreateAccount
              isSuperAdmin={isSuperAdmin}
              setAllUsers={setAllUsers}
              setDriverUsers={setDriverUsers}
              setAdminUsers={setAdminUsers}
              updateDisplay={updateDisplay}
            />
          </Flex>
        )}
      </Flex>
      <UserTable
        isSuperAdmin={isSuperAdmin}
        users={displayedUsers}
        setAllUsers={setAllUsers}
        setDriverUsers={setDriverUsers}
        setAdminUsers={setAdminUsers}
        updateDisplay={updateDisplay}
      />
    </Flex>
  );
};

ManageStaff.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ManageStaff);

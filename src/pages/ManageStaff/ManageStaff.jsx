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
  Box,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Fuse from 'fuse.js';
import { PNPBackend } from '../../utils/utils';
import { getCurrentUserId } from '../../utils/AuthUtils';
import CreateAccount from '../../components/CreateAccount/CreateAccount';
import menuIcon from '../../assets/Menu.svg';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import { AUTH_ROLES } from '../../utils/config';
import UserTable from '../../components/UserTable/UserTable';
import ManageStaffPagination from '../../components/PaginationFooter/ManageStaffPagination';

const { SUPERADMIN_ROLE, DRIVER_ROLE, ADMIN_ROLE } = AUTH_ROLES;

const ManageStaff = ({ cookies }) => {
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [driverUsers, setDriverUsers] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [currFilter, setCurrFilter] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fuse = new Fuse(allUsers, {
    keys: ['firstName', 'lastName', 'email'],
  });

  const updateDisplay = () => {
    if (currFilter === 'all') {
      setFilteredUsers(allUsers);
      fuse.setCollection(allUsers);
    } else if (currFilter === 'admin') {
      setFilteredUsers(adminUsers);
      fuse.setCollection(adminUsers);
    } else {
      setFilteredUsers(driverUsers);
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
      setFilteredUsers(data.filter(user => user.id !== userId));
    } else {
      const driverData = data.filter(d => d.role === DRIVER_ROLE);
      setAllUsers(driverData);
      setDriverUsers(driverData);
      setFilteredUsers(driverData);
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
      setFilteredUsers(filteredResults);
    }
  };

  useEffect(() => {
    updateDisplay();
  }, [currFilter, allUsers, driverUsers, adminUsers]);

  return (
    <>
      <Flex direction="column" my="30px" mx="34px" overflow="hidden">
        <Flex mb="20px" justify="space-between" vertical-align="center">
          <Flex verticalAlign="bottom">
            <InputGroup mr={5} width={300}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder={isSuperAdmin ? 'Search Staff' : 'Search Drivers'}
                onChange={search}
              />
            </InputGroup>
            {isSuperAdmin && currFilter === 'admin' && (
              <Tag bgColor="blue.50" p="10px 24px 10px 24px">
                <TagLabel lineHeight="28px" fontSize={18} fontWeight={600} color="black">
                  Admin
                </TagLabel>
                <TagCloseButton onClick={() => setCurrFilter('all')} />
              </Tag>
            )}
            {isSuperAdmin && currFilter === 'driver' && (
              <Tag bgColor="blue.50" p="10px 24px 10px 24px">
                <TagLabel lineHeight="28px" fontSize={18} fontWeight={600} color="black">
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
                    variant="outline"
                    p="10px 24px 10px 24px"
                    borderRadius="6px"
                    fontSize="18px"
                    fontWeight={600}
                    lineHeight="28px"
                    borderWidth="1px"
                    borderColor="blackAlpha.700"
                    color="blackAlpha.700"
                    leftIcon={<Image src={menuIcon} h="9px" />}
                  >
                    Filter
                  </MenuButton>
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

        <Box position="sticky">
          <ManageStaffPagination data={filteredUsers} setData={setDisplayedUsers} />
        </Box>
      </Flex>
    </>
  );
};

ManageStaff.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ManageStaff);

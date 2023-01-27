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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { PNPBackend } from '../../utils/utils';
import { getUserFromDB } from '../../utils/AuthUtils';
import styles from './ManageStaff.css';
import CreateAccount from '../../components/CreateAccount/CreateAccount';
import menuIcon from '../../assets/Menu.svg';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import AUTH_ROLES from '../../utils/AuthConfig';
import UserTable from '../../components/UserTable/UserTable';

const { SUPERADMIN_ROLE, DRIVER_ROLE, ADMIN_ROLE } = AUTH_ROLES.AUTH_ROLES;

const ManageStaff = ({ cookies }) => {
  const [users, setUsers] = useState([]);
  const [usersCopy, setUsersCopy] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userId, setUserId] = useState([]);

  const refreshData = async () => {
    await getUserFromDB().then(result => {
      setUserId(result.id);
    });
    const currentUserRole = await cookies.get(cookieKeys.ROLE);
    const { data } = await PNPBackend.get('/users');

    if (currentUserRole === SUPERADMIN_ROLE) {
      setIsSuperAdmin(true);
      setUsers(data.filter(user => user.id !== userId));
      setUsersCopy(data.filter(user => user.id !== userId));
    } else {
      const driverData = data.filter(d => d.role === DRIVER_ROLE);
      setUsers(driverData);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getAdmins = () => {
    const adminData = usersCopy.filter(
      user => user.role === ADMIN_ROLE || user.role === SUPERADMIN_ROLE,
    );
    setUsers(adminData);
  };

  const getDrivers = () => {
    const driverData = usersCopy.filter(user => user.role === DRIVER_ROLE);
    setUsers(driverData);
  };

  return (
    <Flex direction="column" m={10}>
      <Flex mb={10} justify="space-between" vertical-align="center">
        <Flex verticalAlign="bottom">
          <InputGroup mr={5} width={300}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Search Staff" className={styles['search-bar']} />
          </InputGroup>
        </Flex>
        {isSuperAdmin ? (
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
                  <MenuItem onClick={getAdmins} fontSize={15} minH={0} height="30px" mt={0}>
                    Admin
                  </MenuItem>
                  <MenuDivider borderColor="gray" mb={1} mt={1} />
                  <MenuItem onClick={getDrivers} fontSize={15} minH={0} height="30px">
                    Driver
                  </MenuItem>
                </MenuList>
              </Flex>
            </Menu>
            <CreateAccount isSuperAdmin={isSuperAdmin} refreshData={refreshData} />
          </Flex>
        ) : null}
      </Flex>
      <UserTable isSuperAdmin={isSuperAdmin} users={users} />
    </Flex>
  );
};

ManageStaff.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ManageStaff);

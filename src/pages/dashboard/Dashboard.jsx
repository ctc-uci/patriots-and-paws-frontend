import React, { useEffect, useState } from 'react';
import { instanceOf } from 'prop-types';
import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import Logout from '../../components/Logout/Logout';
import { getUserFromDB } from '../../utils/AuthUtils';
import DriverNavbar from '../../components/Navbar/DriverNavbar';
import AdminNavbar from '../../components/Navbar/AdminNavbar';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import AUTH_ROLES from '../../utils/AuthConfig';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const Dashboard = ({ cookies }) => {
  const [user, setUser] = useState({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    const checkIsSuperAdmin = () => {
      const currentUserRole = cookies.get(cookieKeys.ROLE);
      setIsSuperAdmin(currentUserRole === SUPERADMIN_ROLE);
    };
    const checkIsAdmin = () => {
      const currentUserRole = cookies.get(cookieKeys.ROLE);
      setIsAdmin(currentUserRole === ADMIN_ROLE);
    };
    const checkIsDriver = () => {
      const currentUserRole = cookies.get(cookieKeys.ROLE);
      setIsDriver(currentUserRole === DRIVER_ROLE);
    };
    const fetchUserFromDB = async () => {
      const userFromDB = await getUserFromDB();
      setUser(userFromDB);
    };
    fetchUserFromDB();
    checkIsSuperAdmin();
    checkIsAdmin();
    checkIsDriver();
  }, []);

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack align="center">
        {isDriver && <DriverNavbar name={user.firstName} />}
        {(isSuperAdmin || isAdmin) && <AdminNavbar />}
        <Heading>DASHBOARD</Heading>
        <Text>Hello, {user.firstName}!</Text>
        <Logout />
      </Stack>
    </Flex>
  );
};

Dashboard.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Dashboard);

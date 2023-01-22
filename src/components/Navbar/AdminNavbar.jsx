import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import {
  Link,
  Image,
  Box,
  HStack,
  LinkBox,
  LinkOverlay,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { logout, useNavigate, getUserFromDB } from '../../utils/AuthUtils';
import { Cookies } from '../../utils/CookieUtils';
import pnpLogo from './PNPlogo.png';

const AdminNavbar = ({ cookies }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUserFromDB = async () => {
      const userFromDB = await getUserFromDB();
      setUser(userFromDB);
    };
    fetchUserFromDB();
  }, []);

  const navigate = useNavigate();
  // const [errorMessage, setErrorMessage] = useState();
  const handleSubmit = async () => {
    try {
      await logout('/login', navigate, cookies);
    } catch (err) {
      // setErrorMessage(err.message);
    }
  };

  return (
    <Box bg="lightblue">
      <LinkBox>
        <HStack spacing="24px">
          <LinkOverlay href="https://www.patriotsandpaws.org/">
            <Image
              boxSize="3rem"
              src={pnpLogo}
              alt="Patriots and Paws logo, redirects to main page"
            />
          </LinkOverlay>
          <Link as={NavLink} to="/">
            Inventory
          </Link>
          <Link as={NavLink} to="/routes">
            Routes
          </Link>
          <Link as={NavLink} to="/donate">
            Manage Donation Form
          </Link>
          <Link as={NavLink} to="/drivers">
            Manage Staff
          </Link>
          <Menu>
            <MenuButton as={Button}>{user.firstName}</MenuButton>
            <MenuList>
              <MenuItem>
                <Link as={NavLink} to="/user:userid">
                  Profile
                </Link>
              </MenuItem>
              <MenuItem>
                <Link as={NavLink} to="/login" onClick={handleSubmit}>
                  Logout
                </Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </LinkBox>
    </Box>
  );
};

AdminNavbar.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default AdminNavbar;

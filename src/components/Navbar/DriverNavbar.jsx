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
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { logout, useNavigate, getUserFromDB } from '../../utils/AuthUtils';
import { Cookies } from '../../utils/CookieUtils';
import pnpLogo from './PNPlogo.png';

const DriverNavbar = ({ cookies }) => {
  const [user, setUser] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      <HStack spacing="24px">
        <LinkBox>
          <LinkOverlay href="https://www.patriotsandpaws.org/" isExternal>
            <Image
              boxSize="3rem"
              src={pnpLogo}
              alt="Patriots and Paws logo, redirects to main page"
            />
          </LinkOverlay>
        </LinkBox>
        <Link as={NavLink} to="/">
          Dashboard
        </Link>
        <Menu isOpen={isOpen}>
          <MenuButton
            as={Button}
            variant="ghost"
            mx={1}
            py={[1, 2, 2]}
            px={4}
            borderRadius={5}
            _hover={{ bg: 'white' }}
            aria-label="User Dropdown"
            fontWeight="normal"
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
          >
            {user.firstName}
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </MenuButton>
          <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
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
    </Box>
  );
};

DriverNavbar.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default DriverNavbar;

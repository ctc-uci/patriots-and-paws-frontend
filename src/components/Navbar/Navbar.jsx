import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import {
  Link,
  Image,
  Flex,
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
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import pnpLogo from './PNPlogo.png';
import AUTH_ROLES from '../../utils/AuthConfig';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const Navbar = ({ cookies }) => {
  const [user, setUser] = useState({});
  const [role, setRole] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    const checkRole = () => {
      const currentUserRole = cookies.get(cookieKeys.ROLE);
      setRole(currentUserRole);
    };
    const fetchUserFromDB = async () => {
      const userFromDB = await getUserFromDB();
      setUser(userFromDB);
    };
    // FIXME
    setTimeout(fetchUserFromDB, 600);
    checkRole();
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
    <Flex
      as="nav"
      bgColor="lightblue"
      align="center"
      justify="space-between"
      position="sticky"
      zIndex="sticky"
      top={0}
      h="60px"
    >
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
        {role === DRIVER_ROLE && (
          <Link as={NavLink} to="/">
            Dashboard
          </Link>
        )}
        {(role === ADMIN_ROLE || role === SUPERADMIN_ROLE) && (
          <>
            <Link as={NavLink} to="/">
              Inventory
              <Link as={NavLink} to="/routes">
                Routes
              </Link>
            </Link>
            <Link as={NavLink} to="/donate/edit">
              Manage Donation Form
            </Link>
            <Link as={NavLink} to="/drivers">
              Manage Staff
            </Link>
          </>
        )}
        <Link as={NavLink} to={`/user/${user.id}`}>
          Profile
        </Link>
        <Link as={NavLink} to="/login" onClick={handleSubmit}>
          Logout
        </Link>
      </HStack>
      <Menu isOpen={isOpen} alignSelf="right">
        <MenuButton
          as={Button}
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
          {user.lastName && user.firstName && `${user.lastName}, ${user.firstName}`}
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </MenuButton>
        <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
          <MenuItem>
            <Link as={NavLink} to="/user">
              Profile
            </Link>
          </MenuItem>
          <MenuItem>
            <Button onClick={handleSubmit}>Logout</Button>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

Navbar.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Navbar);

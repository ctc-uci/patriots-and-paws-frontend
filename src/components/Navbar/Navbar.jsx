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
import { logout, useNavigate, getUserFromDB, auth, getCurrentUser } from '../../utils/AuthUtils';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import pnpLogo from './PNPlogo.png';
import EditAccountModal from '../EditAccountModal/EditAccountModal';
import { AUTH_ROLES } from '../../utils/config';

const { SUPERADMIN_ROLE, ADMIN_ROLE } = AUTH_ROLES;

const Navbar = ({ cookies }) => {
  const [user, setUser] = useState({});
  const [role, setRole] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();

  useEffect(() => {
    const checkRole = () => {
      const currentUserRole = cookies.get(cookieKeys.ROLE);
      setRole(currentUserRole);
    };
    const fetchUserFromDB = async () => {
      const { uid } = await getCurrentUser(auth);
      const userFromDB = await getUserFromDB(uid);
      setUser(userFromDB);
    };
    fetchUserFromDB();
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
      <EditAccountModal data={user} isOpen={isProfileOpen} onClose={onProfileClose} isSuperAdmin />

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

        {role && (
          <>
            <Link as={NavLink} to="/">
              Dashboard
            </Link>
            {(role === ADMIN_ROLE || role === SUPERADMIN_ROLE) && (
              <>
                <Link as={NavLink} to="/donate/edit">
                  Manage Donation Form
                </Link>
                <Link as={NavLink} to="/manage-staff">
                  Manage Staff
                </Link>
              </>
            )}
          </>
        )}
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
          <MenuItem onClick={onProfileOpen}>Profile</MenuItem>
          <MenuItem onClick={handleSubmit}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

Navbar.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Navbar);

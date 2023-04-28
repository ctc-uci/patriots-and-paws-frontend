import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { logout, useNavigate, getUserFromDB, auth, getCurrentUser } from '../../utils/AuthUtils';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import pnpLogo from './PNPlogo.png';
import ProfileModal from '../EditAccountModal/ProfileModal';
import { AUTH_ROLES } from '../../utils/config';

const { DRIVER_ROLE } = AUTH_ROLES;

const Navbar = ({ cookies }) => {
  const [user, setUser] = useState({});
  const [role, setRole] = useState('');
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
  const location = useLocation();
  const showFullMenu = useBreakpointValue(
    {
      base: false,
      md: true,
    },
    {
      fallback: true,
    },
  );

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
  // react reload on user role change using a useEffect
  useEffect(() => {
    const currentUserRole = cookies.get(cookieKeys.ROLE);
    setRole(currentUserRole);
  }, [role]);

  const navigate = useNavigate();
  // const [errorMessage, setErrorMessage] = useState();
  const handleSubmit = async () => {
    try {
      await logout('/login', navigate, cookies);
    } catch (err) {
      // setErrorMessage(err.message);
    }
  };

  const makeNavTabs = (page, path) => {
    const selectedTab = location.pathname === path;
    return (
      <Link
        as={NavLink}
        to={path}
        _hover={{ textDecoration: 'none' }}
        paddingY="1.5em"
        borderBottom={selectedTab && '2px solid'}
        borderColor={selectedTab && 'blue.500'}
      >
        <Text
          color={selectedTab ? 'blue.500' : 'gray.500'}
          fontSize="1.2em"
          mx="1em"
          _hover={{ color: 'blue.600' }}
        >
          {page}
        </Text>
      </Link>
    );
  };

  return (
    <Flex
      as="nav"
      bgColor="gray.100"
      align="center"
      justify="space-between"
      position="sticky"
      zIndex="sticky"
      top={0}
      px="0.75em"
      boxShadow="md"
    >
      <ProfileModal data={user} setData={setUser} isOpen={isProfileOpen} onClose={onProfileClose} />
      <LinkBox>
        <LinkOverlay href="https://www.patriotsandpaws.org/" isExternal>
          <HStack spacing="24px">
            <Image
              boxSize="3rem"
              src={pnpLogo}
              alt="Patriots and Paws logo, redirects to main page"
            />
            <Link
              fontSize="1.2em"
              fontStyle="bold"
              href="https://www.patriotsandpaws.org/"
              isExternal
              _hover={{ textDecoration: 'none' }}
            >
              Patriots and Paws
            </Link>
          </HStack>
        </LinkOverlay>
      </LinkBox>
      <HStack>
        {role !== DRIVER_ROLE && (
          <Flex align="center">
            {makeNavTabs('Dashboard', '/')}
            {makeNavTabs('Manage Donation Form', '/donate/edit')}
            {makeNavTabs('Manage Staff', '/manage-staff')}
          </Flex>
        )}
      </HStack>
      <Menu alignSelf="right">
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              mx={1}
              py={[1, 2, 2]}
              px={4}
              borderRadius={5}
              bgColor={showFullMenu ? 'white' : 'transparent'}
              aria-label="User Dropdown"
              fontWeight="normal"
              fontSize="1.2em"
              shadow={{ md: 'md' }}
              my="1em"
            >
              {showFullMenu &&
                user.lastName &&
                user.firstName &&
                `${user.firstName} ${user.lastName}`}
              {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onProfileOpen}>Profile</MenuItem>
              <MenuItem onClick={handleSubmit}>Logout</MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    </Flex>
  );
};

Navbar.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Navbar);

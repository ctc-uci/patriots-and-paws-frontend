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
  Tag,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { logout, useNavigate, getUserFromDB, auth, getCurrentUser } from '../../utils/AuthUtils';
import { withCookies, Cookies, cookieKeys } from '../../utils/CookieUtils';
import pnpLogo from './PNPlogo.png';
import ProfileModal from '../EditAccountModal/ProfileModal';
import { AUTH_ROLES } from '../../utils/config';

const { SUPERADMIN_ROLE, ADMIN_ROLE } = AUTH_ROLES;

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

  const makeTag = page => {
    return (
      <Tag
        size="md"
        borderRadius="full"
        bgColor="rgb(66,153,225)"
        color="white"
        fontSize="1.2em"
        ml="1em"
        mr="1em"
      >
        {page}
      </Tag>
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
      h="60px"
      p="2.5em 0.75em"
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
        {role && (role === ADMIN_ROLE || role === SUPERADMIN_ROLE) && (
          <Flex align="center">
            {location.pathname === '/' ? (
              makeTag('Dashboard')
            ) : (
              <Link as={NavLink} to="/">
                <Text color="rgb(113,128,150)" fontSize="1.2em" ml="1em" mr="1em">
                  Dashboard
                </Text>
              </Link>
            )}
            {location.pathname === '/donate/edit' ? (
              makeTag('Manage Donation Form')
            ) : (
              <Link as={NavLink} to="/donate/edit">
                <Text color="rgb(113,128,150)" fontSize="1.2em" ml="1em" mr="1em">
                  Manage Donation Form
                </Text>
              </Link>
            )}
            {location.pathname === '/manage-staff' ? (
              makeTag('Manage Staff')
            ) : (
              <Link as={NavLink} to="/manage-staff">
                <Text color="rgb(113,128,150)" fontSize="1.2em" ml="1em" mr="1em">
                  Manage Staff
                </Text>
              </Link>
            )}
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
              shadow="md"
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

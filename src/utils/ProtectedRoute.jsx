import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { PropTypes, instanceOf } from 'prop-types';
import { Spinner } from '@chakra-ui/react';
import { withCookies, Cookies } from './CookieUtils';
import { userIsAuthenticated } from './AuthUtils';

/**
 * Protects a route from unauthenticated users
 * @param {Component} children The component the user is trying to access
 * @param {string} redirectPath The path to redirect the user to if they're not logged in
 * @param {Array} roles A list of roles that are allowed to access the route
 * @param {Cookies} cookies The user's current cookies
 * @returns The relevant path to redirect the user to depending on authentication state.
 */
const ProtectedRoute = ({ Component, redirectPath, roles, cookies }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      const authenticated = await userIsAuthenticated(cookies, roles);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    checkUserAuthentication();
  }, []);
  if (isLoading) {
    return <Spinner />;
  }
  if (isAuthenticated) {
    return <Component />;
  }
  return <Navigate to={redirectPath} />;
};

ProtectedRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
  redirectPath: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ProtectedRoute);

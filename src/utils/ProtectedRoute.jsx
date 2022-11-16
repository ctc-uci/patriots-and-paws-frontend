import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { PropTypes, instanceOf } from 'prop-types';
import { withCookies, cookieKeys, Cookies, clearCookies } from './CookieUtils';
import { refreshToken } from './AuthUtils';
import { PNPBackend } from './utils';

const userIsAuthenticated = async (roles, cookies) => {
  try {
    const accessToken = await refreshToken(cookies);
    if (!accessToken) {
      return false;
    }
    const loggedIn = await PNPBackend.get(`/auth/verifyToken/${accessToken}`);
    return roles.includes(cookies.get(cookieKeys.ROLE)) && loggedIn.status === 200;
  } catch (err) {
    clearCookies(cookies);
    return false;
  }
};

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

  useEffect(async () => {
    const authenticated = await userIsAuthenticated(roles, cookies);
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);
  if (isLoading) {
    return <h1>LOADING...</h1>;
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

import { withCookies, Cookies } from 'react-cookie';

/**
 * Options for the format of a cookie
 * More information available here: https://www.npmjs.com/package/react-cookie
 * This is used when setting a cookie
 */
const cookieConfig = {
  maxAge: 3600,
  path: '/',
  secure: true && document.location.protocol === 'https:',
};

/**
 * An object containing keys for cookies to store
 * This is used to set and remove cookies
 */
const cookieKeys = {
  ACCESS_TOKEN: 'accessToken',
  ROLE: 'role',
};

/**
 * Clears all cookies stored during log in
 * @param {Cookies} cookies THe user's current cookies
 */
const clearCookies = cookies => {
  Object.values(cookieKeys).forEach(value => {
    cookies.remove(value);
  });
};

export { withCookies, Cookies, cookieConfig, cookieKeys, clearCookies };

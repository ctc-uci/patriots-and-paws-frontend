import axios from 'axios';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  applyActionCode,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { cookieKeys, cookieConfig, clearCookies } from './CookieUtils';
import { PNPBackend, toCapitalCase } from './utils';

// Using Firebase Web version 9
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);

const refreshUrl = `https://securetoken.googleapis.com/v1/token?key=${process.env.REACT_APP_FIREBASE_APIKEY}`;

/**
 * Sets a cookie in the browser
 * @param {string} key key for the cookie
 * @param {string} value value for the cookie
 * @param {cookieConfig} config cookie config to use
 */
const setCookie = (key, value, config) => {
  let cookie = `${key}=${value}; max-age=${config.maxAge}; path=${config.path}`;
  if (config.domain) {
    cookie += `; domain=${config.domain}`;
  }
  if (config.secure) {
    cookie += '; secure';
  }
  document.cookie = cookie;
};

/**
 * Returns the current user synchronously
 * @param {Auth} authInstance
 * @returns The current user (or undefined)
 */
const getCurrentUser = authInstance =>
  new Promise((resolve, reject) => {
    const unsubscribe = authInstance.onAuthStateChanged(
      user => {
        unsubscribe();
        resolve(user);
      },
      err => {
        reject(err);
      },
    );
  });

// Get current user's id
const getCurrentUserId = () => {
  return auth.currentUser.uid;
};

// Get user from PNP DB using a user id
const getUserFromDB = async id => {
  const res = await PNPBackend.get(`/users/${id}`);
  const user = res.data[0];
  return user;
};

// Get current user's role from PNP DB
const getCurrentUserRole = async () => {
  const res = await PNPBackend.get(`/users/${auth.currentUser.uid}`);
  const { role } = res.data[0];
  return role;
};

// Refreshes the current user's access token by making a request to Firebase
const refreshToken = async () => {
  const currentUser = await getCurrentUser(auth);
  if (currentUser) {
    const refreshT = currentUser.refreshToken;
    const {
      data: { access_token: idToken },
    } = await axios.post(refreshUrl, {
      grant_type: 'refresh_token',
      refresh_token: refreshT,
    });
    // Sets the appropriate cookies after refreshing access token
    setCookie(cookieKeys.ACCESS_TOKEN, idToken, cookieConfig);
    const res = await PNPBackend.get(`/users/${auth.currentUser.uid}`);
    const { role } = res.data[0];
    setCookie(cookieKeys.ROLE, role, cookieConfig);
    return idToken;
  }
  return null;
};

/**
 * Makes requests to add user to PNP DB. Deletes user if Firebase error
 * @param {object} user A user object with firstName, lastName, email, phoneNumber, password, and role properties
 * @param {string} id User ID from Firebase
 */
const createUserInDB = async (user, id) => {
  const { firstName, lastName, email, phoneNumber, password, role } = user;
  try {
    await PNPBackend.post('/users', {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      id,
    });
  } catch (err) {
    // Since this route is called after user is created in firebase, if this
    // route errors out, that means we have to discard the created firebase object
    await signInWithEmailAndPassword(auth, email, password);

    const userToBeTerminated = await auth.currentUser;
    userToBeTerminated.delete();
    throw new Error(err.message);
  }
};

/**
 * Logs a user in with email and password
 * @param {string} email The email to log in with
 * @param {string} password The password to log in with
 * @param {string} redirectPath The path to redirect the user to after logging out
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 * @param {Cookies} cookies The user's cookies to populate
 * @returns A boolean indicating whether or not the log in was successful
 */
const logInWithEmailAndPassword = async (email, password, redirectPath, navigate, cookies) => {
  await signInWithEmailAndPassword(auth, email, password);
  cookies.set(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
  const res = await PNPBackend.get(`/users/${auth.currentUser.uid}`);
  const { role } = res.data[0];
  cookies.set(cookieKeys.ROLE, role, cookieConfig);
  navigate(redirectPath);
};

const logInCurrentUserWithPassword = async password => {
  await signInWithEmailAndPassword(auth, auth.currentUser.email, password);
};

/**
 * Creates a user in firebase database
 * @param {string} email
 * @param {string} password
 * @returns A UserCredential object from firebase
 */
const createUserInFirebase = async (email, password) => {
  const user = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  return user.user;
};

/**
 * Creates a user (both in firebase and database)
 * @param {object} user A user object with firstName, lastName, email, phoneNumber, password, and role properties
 * @returns A UserCredential object from firebase
 */
const createUser = async user => {
  const { email, password } = user;
  const firebaseUser = await createUserInFirebase(email, password);
  await createUserInDB(user, firebaseUser.uid);
  await secondaryAuth.signOut();
  return firebaseUser.uid;
};

// Updates user information in PNP DB
const updateUser = async (user, id) => {
  let { firstName, lastName } = user;
  const { email, phoneNumber, role, newPassword } = user;
  firstName = toCapitalCase(firstName);
  lastName = toCapitalCase(lastName);
  try {
    await PNPBackend.put(`/users/${id}`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      id,
      newPassword,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Registers a new user using the email provider
 * @param {object} user A user object with firstName, lastName, email, phoneNumber, password, and role properties
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 * @param {string} redirectPath path to redirect users once logged in
 */
const registerWithEmailAndPassword = async user => {
  const uid = await createUser(user);
  return uid;
};

/**
 * Sends a password reset email given an email
 * @param {string} email The email to resend password to
 */
const sendPasswordReset = async email => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Completes the password reset process, given a confirmation code and new password
 * @param {string} code The confirmation code sent via email to the user
 * @param {string} newPassword The new password
 */
const confirmNewPassword = async (code, newPassword) => {
  await confirmPasswordReset(auth, code, newPassword);
};

/**
 * Applies a verification code sent to the user by email or other out-of-band mechanism.
 * @param {string} code The confirmation code sent via email to the user
 */
const confirmVerifyEmail = async code => {
  await applyActionCode(auth, code);
};

/**
 * Logs a user out
 * @param {string} redirectPath The path to redirect the user to after logging out
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 */
const logout = async (redirectPath, navigate, cookies) => {
  await signOut(auth);
  navigate(redirectPath);
  clearCookies(cookies);
};

// Checks if user is authenticated
const userIsAuthenticated = async (cookies, roles = null) => {
  try {
    const accessToken = await refreshToken(cookies);
    if (!accessToken) {
      return false;
    }
    const loggedIn = await PNPBackend.get(`/auth/verifyToken/${accessToken}`);
    return loggedIn.status === 200 && (!roles || roles.includes(cookies.get(cookieKeys.ROLE)));
  } catch (err) {
    clearCookies(cookies);
    return false;
  }
};

/**
 * Adds an axios interceptor for auth to given axiosInstance
 * @param {AxiosInstance} axiosInstance instance of axios to apply interceptor to
 */
const addAuthInterceptor = axiosInstance => {
  // This response interceptor will refresh the user's access token using the refreshToken helper method
  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            // check if 400 error was token
            if (data === '@verifyToken no access token') {
              // token has expired;
              try {
                // attempting to refresh token;
                await refreshToken();
                // token refreshed, reattempting request;
                const { config } = error.response;
                // configure new request in a new instance;
                return await axios({
                  method: config.method,
                  url: `${config.baseURL}${config.url}`,
                  data: config.data,
                  params: config.params,
                  headers: config.headers,
                  withCredentials: true,
                });
              } catch (e) {
                return Promise.reject(e);
              }
            } else {
              return Promise.reject(error);
            }
          default:
            return Promise.reject(error);
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        return Promise.reject(error);
      } else {
        // Something happened in setting up the request that triggered an Error
        return Promise.reject(error);
      }
    },
  );
};

addAuthInterceptor(PNPBackend);

export {
  auth,
  useNavigate,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  addAuthInterceptor,
  sendPasswordReset,
  logout,
  userIsAuthenticated,
  refreshToken,
  getCurrentUser,
  getCurrentUserId,
  getUserFromDB,
  updateUser,
  getCurrentUserRole,
  confirmNewPassword,
  confirmVerifyEmail,
  logInCurrentUserWithPassword,
};

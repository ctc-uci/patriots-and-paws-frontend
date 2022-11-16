import axios from 'axios';

let baseURL = '';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  baseURL = `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`;
} else {
  // production code
  baseURL = `${process.env.REACT_APP_PROD_API_URL}`;
}

// See auth_utils for AuthInterceptor
const PNPBackend = axios.create({
  baseURL,
  withCredentials: true,
});

// eslint-disable-next-line import/prefer-default-export
export { PNPBackend };

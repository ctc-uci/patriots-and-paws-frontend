import axios from 'axios';
import { renderEmail } from 'react-html-email';

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

// Regular expression for password validation
// Minimum 8 characters
// - At least one lower case alphabetic
// - At least one upper case alphabetic
// - At least one number
// - At least one special character
const passwordRequirementsRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const sendEmail = async (subject, newEmail, emailtemplate) => {
  const response = await PNPBackend.post('/nodemailer/send', {
    email: newEmail,
    messageHtml: renderEmail(emailtemplate),
    subject,
  });
  if (response.status !== 200) {
    throw new Error('Oops, something went wrong. Try again');
  }
};

const formatPhone = value => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return value.replace(phoneRegex, '$1-$2-$3');
};
// eslint-disable-next-line import/prefer-default-export
export { PNPBackend, passwordRequirementsRegex, sendEmail, formatPhone };

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
  headers: { 'Access-Control-Allow-Credentials': '*' },
});

const sendEmail = async (newEmail, emailtemplate) => {
  const response = await PNPBackend.post('/nodemailer/send', {
    email: newEmail,
    messageHtml: renderEmail(emailtemplate),
    subject: 'test!',
  });
  if (response.status !== 200) {
    throw new Error('Oops, something went wrong. Try again');
  }
};

export { PNPBackend, sendEmail };

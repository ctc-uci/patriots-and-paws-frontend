import axios from 'axios';

let baseURL = '';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  baseURL = `${process.env.REACT_APP_API_URL}`;
} else {
  // production code
  baseURL = `${process.env.REACT_APP_PROD_API_URL}`;
}

// See auth_utils for AuthInterceptor
const PNPBackend = axios.create({
  baseURL,
  headers: { 'Access-Control-Allow-Credentials': '*' },
});

// export const sendEmail = async (name, email, messageHtml, subject) => {
//   const response = await FYABackend.post('/nodemailer/send', {
//     name,
//     email,
//     messageHtml: renderEmail(messageHtml),
//     subject,
//   });
//   if (response.status !== 200) {
//     throw new Error('Oops, something went wrong. Try again');
//   }
// };

// eslint-disable-next-line import/prefer-default-export
export { PNPBackend };

import axios from 'axios';
import { renderEmail } from 'react-html-email';

// See auth_utils for AuthInterceptor
const PNPBackend = axios.create({
  baseURL:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_BACKEND_HOST
      : process.env.REACT_APP_BACKEND_HOST_PROD,
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

const formatPhonePDF = value => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return value.replace(phoneRegex, '($1) $2 - $3');
};

// create address string from address components
const formatAddress = ({ addressStreet, addressUnit, addressCity, addressZip }) => {
  const addressArray = [addressStreet, addressUnit, addressCity, `CA ${addressZip}`].filter(
    Boolean,
  );
  return addressArray.join(', ');
};

// creates Google Maps URL for route and opens it in new window
const handleNavigateToAddress = donations => {
  const addresses = donations.map(donation => formatAddress(donation));
  const n = addresses.length;

  // set all addresses except last one as waypoint
  const waypoints = addresses.slice(0, -1).join('|');
  // set last address as destination
  const destination = addresses[n - 1];

  // no origin parameter specified so that origin will default to device location
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination,
  )}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`;
  window.open(googleMapsUrl, '_blank');
};

const calendarConfigs = {
  dateFormat: 'MM-dd-yyyy',
};

const formatDate = date => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// eslint-disable-next-line import/prefer-default-export
export {
  PNPBackend,
  passwordRequirementsRegex,
  sendEmail,
  formatPhone,
  formatPhonePDF,
  formatAddress,
  handleNavigateToAddress,
  calendarConfigs,
  formatDate,
};

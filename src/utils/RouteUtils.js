import { StyleSheet } from '@react-pdf/renderer';
import { PNPBackend } from './utils';

const getAllRoutes = async () => {
  const { data } = await PNPBackend.get(`/routes`);
  return data;
};

const getRoute = async routeId => {
  const { data } = await PNPBackend.get(`/routes/${routeId}`);
  return data[0];
};

const createRoute = async route => {
  const { driverId, name, date } = route;
  try {
    const { data } = await PNPBackend.post('/routes', {
      driverId,
      name,
      date,
    });
    return data[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateRoute = async route => {
  const { id, driverId, name, date } = route;
  try {
    await PNPBackend.put(`/routes/${id}`, {
      driverId,
      name,
      date,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const getDrivers = async () => {
  const { data } = await PNPBackend.get('/users/drivers');
  return data;
};

const getDonations = async routeId => {
  const res = await getRoute(routeId);
  return res.donations;
};

const updateDonation = async donation => {
  const {
    id,
    routeId,
    orderNum,
    status,
    addressStreet,
    addressUnit,
    addressCity,
    addressZip,
    firstName,
    lastName,
    email,
    phoneNum,
    notes,
  } = donation;
  try {
    await PNPBackend.put(`/donations/${id}`, {
      routeId,
      orderNum,
      status,
      addressStreet,
      addressUnit,
      addressCity,
      addressZip,
      firstName,
      lastName,
      email,
      phoneNum,
      notes,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const getRouteDonations = async routeId => {
  const { data } = await PNPBackend.get(`/routes/${routeId}`);
  return data[0];
};

const getDriverName = async driverId => {
  const { data } = await PNPBackend.get(`/users/${driverId}`);
  const user = data[0];
  return `${user.firstName} ${user.lastName}`;
};

const formatDate = date =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

const formatDatePDF = date => {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return formattedDate.replace(',', ':');
};

const A4_WIDTH = 595.28; // can use instead of "A4" for page size to get one long page

const routePDFStyles = StyleSheet.create({
  viewer: {
    width: '100%',
    height: '80vh',
  },
});

const todaysDate = new Date().toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'America/Los_Angeles',
});

const standardizeDate = date => {
  const now = new Date(date);
  return date && now.toISOString().replace(/T.+/, '');
};

const dateHasPassed = date => {
  const today = standardizeDate(todaysDate);
  const selectedRouteDate = standardizeDate(date);
  return selectedRouteDate < today;
};

export {
  getAllRoutes,
  getRoute,
  createRoute,
  updateRoute,
  getDrivers,
  getDonations,
  updateDonation,
  getRouteDonations,
  getDriverName,
  formatDate,
  formatDatePDF,
  A4_WIDTH,
  routePDFStyles,
  todaysDate,
  dateHasPassed,
  standardizeDate,
};

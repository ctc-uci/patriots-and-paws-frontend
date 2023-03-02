import { PNPBackend } from './utils';

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
  });

const A4_WIDTH = 595.28; // can use instead of "A4" for page size to get one long page

export { getRouteDonations, getDriverName, formatDate, A4_WIDTH };

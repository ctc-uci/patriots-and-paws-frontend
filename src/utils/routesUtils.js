import { PNPBackend } from './utils';

const getRouteDonations = async routeId => {
  const donations = await PNPBackend.get(`/routes/${routeId}`);
  return donations.data[0];
};

const getDriver = async driverId => {
  const res = await PNPBackend.get(`/users/${driverId}`);
  const user = res.data[0];
  return `${user.firstName} ${user.lastName}`;
};

export { getRouteDonations, getDriver };

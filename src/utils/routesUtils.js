import { PNPBackend } from './utils';

const getRouteDonations = async routeId => {
  const donations = await PNPBackend.get(`/routes/${routeId}`);
  return donations.data;
};

export default getRouteDonations;

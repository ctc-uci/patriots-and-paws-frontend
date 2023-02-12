import { PNPBackend } from './utils';
import AUTH_ROLES from './AuthConfig';

const { DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const getAllRoutes = async () => {
  const res = await PNPBackend.get(`/routes/`);
  return res.data;
};

const getRoute = async routeId => {
  const res = await PNPBackend.get(`/routes/${routeId}`);
  return res.data[0];
};

const createRoute = async route => {
  const { driverId, name, date } = route;
  try {
    const res = await PNPBackend.post('/routes/', {
      driverId,
      name,
      date,
    });
    return res.data[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateRoute = async route => {
  const { routeId, driverId, name, date } = route;
  try {
    await PNPBackend.put(`/routes/${routeId}`, {
      driverId,
      name,
      date,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const getDrivers = async () => {
  const users = await PNPBackend.get('/users/');
  const drivers = users.data.filter(user => user.role === DRIVER_ROLE);
  return drivers;
};

export { getAllRoutes, getRoute, createRoute, updateRoute, getDrivers };

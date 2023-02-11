import { PNPBackend } from './utils';
import AUTH_ROLES from './AuthConfig';

const { DRIVER_ROLE } = AUTH_ROLES.AUTH_ROLES;

const getAllRoutes = async () => {
  const res = await PNPBackend.get(`/routes/`);
  const routes = res.data;
  return routes;
};

const getRoute = async routeId => {
  const res = await PNPBackend.get(`/routes/${routeId}`);
  const routes = res.data[0];
  return routes;
};

const createRoute = async route => {
  const { driverId, name, date } = route;
  try {
    await PNPBackend.post('/routes/', {
      driverId,
      name,
      date,
    });
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

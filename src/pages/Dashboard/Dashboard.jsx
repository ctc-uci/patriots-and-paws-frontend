import React, { useEffect, useState } from 'react';
import DriverDashboard from './DriverDashboard';
import { getUserFromDB, getCurrentUser, auth } from '../../utils/AuthUtils';
import { AUTH_ROLES } from '../../utils/config';
import InventoryPage from '../../components/InventoryPage/InventoryPage';

const { DRIVER_ROLE } = AUTH_ROLES;

const Dashboard = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const { uid } = await getCurrentUser(auth);
      const userFromDB = await getUserFromDB(uid);
      setUser(userFromDB);
    };
    fetchUserFromDB();
  }, []);

  return <>{user?.role && (user.role === DRIVER_ROLE ? <DriverDashboard /> : <InventoryPage />)}</>;
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { getUserFromDB } from '../../utils/AuthUtils';

const Dashboard = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const userFromDB = await getUserFromDB();
      setUser(userFromDB);
    };
    fetchUserFromDB();
  }, []);

  return (
    <div>
      <h1>DASHBOARD</h1>
      <p>Hello, {user.first_name}!</p>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { useParams } from 'react-router-dom';

const DriverRoutes = () => {
  const { id } = useParams();
  return <p>{id} is the route for the driver</p>;
};

export default DriverRoutes;

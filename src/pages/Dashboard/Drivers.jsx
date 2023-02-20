import React from 'react';
import { useParams } from 'react-router-dom';

const Driver = () => {
  const { id } = useParams();
  return <p>{id} is the driver id</p>;
};

export default Driver;

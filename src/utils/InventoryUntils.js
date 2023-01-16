// import axios from 'axios';
import { PNPBackend } from './utils';

const getDonationsFromDB = async () => {
  const res = await PNPBackend.get(`/donations`);
  const donations = res.data;
  return donations;
};

export default getDonationsFromDB;

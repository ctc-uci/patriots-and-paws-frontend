// import axios from 'axios';
import { PNPBackend } from './utils';

const getDonationsFromDB = async () => {
  const res = await PNPBackend.get(`/donations`);
  const donations = res.data;
  return donations;
};

const getPictureFromDB = async picturesId => {
  const res = await PNPBackend.get(`/pictures/${picturesId}`);
  const image = res.data;
  return image;
};

export { getDonationsFromDB, getPictureFromDB };

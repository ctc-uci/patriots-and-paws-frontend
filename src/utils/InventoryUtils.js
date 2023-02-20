import { PNPBackend } from './utils';

function makeDate(dateDB) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const d = new Date(dateDB);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

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

export { getDonationsFromDB, getPictureFromDB, makeDate };

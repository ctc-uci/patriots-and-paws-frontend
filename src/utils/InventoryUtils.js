import { PNPBackend } from './utils';
import { STATUSES } from './config';

const { PENDING, CHANGES_REQUESTED, SCHEDULED, PICKED_UP, RESCHEDULE } = STATUSES;

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

const getRoutesFromDB = async () => {
  const res = await PNPBackend.get(`/routes`);
  const routes = res.data;
  return routes;
};

const colorMap = {
  [PENDING]: 'blackAlpha',
  [CHANGES_REQUESTED]: 'blue',
  [PICKED_UP]: 'green',
  [SCHEDULED]: 'green',
  [PICKED_UP]: 'blue',
  [RESCHEDULE]: 'orange',
};

const formatImageData = data => {
  if (data.length < 4) {
    return data.reduce((acc, curr) => {
      acc.push([curr]);
      return acc;
    }, []);
  }

  return data.reduce(
    (acc, curr) => {
      const lastGroup = acc[acc.length - 1];
      if (lastGroup.length < 4) {
        lastGroup.push(curr);
      } else {
        acc.push([curr]);
      }
      return acc;
    },
    [[]],
  );
};

const formatFurnitureData = data => {
  return data.reduce(
    (acc, curr) => {
      const lastGroup = acc[acc.length - 1];
      if (lastGroup.length < 4) {
        lastGroup.push(curr);
      } else {
        acc.push([curr]);
      }
      return acc;
    },
    [[]],
  );
};

const EMAIL_TYPE = {
  CANCEL_PICKUP: 'cancel pickup',
  APPROVE: 'approve',
  REQUEST_CHANGES: 'request changes',
  SCHEDULED: 'scheduled',
};

export {
  getDonationsFromDB,
  getRoutesFromDB,
  makeDate,
  formatImageData,
  formatFurnitureData,
  colorMap,
  EMAIL_TYPE,
};

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

const colorMap = {
  APPROVED: 'green',
  PENDING: 'gray',
  CHANGES_REQUESTED: 'blue',
  PICKED_UP: 'green',
  SCHEDULED: 'green',
  ARCHIVED: 'blue',
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

const EMAILSTATUSES = {
  CANCEL_PICKUP: 'cancel pickup',
  APPROVE: 'approve',
  REQUEST_CHANGES: 'request changes',
  SCHEDULED: 'scheduled',
};
export {
  getDonationsFromDB,
  makeDate,
  formatImageData,
  formatFurnitureData,
  colorMap,
  EMAILSTATUSES,
};

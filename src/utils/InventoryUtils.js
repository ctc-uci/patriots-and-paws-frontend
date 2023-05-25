import { PNPBackend } from './utils';
import { STATUSES } from './config';
import { standardizeDate } from './RouteUtils';

const {
  APPROVAL_REQUESTED,
  PENDING,
  CHANGES_REQUESTED,
  SCHEDULING,
  SCHEDULED,
  PICKED_UP,
  RESCHEDULE,
} = STATUSES;

const makeDate = dateDB => {
  const d = new Date(dateDB);
  return d.toUTCString();
};

const routeFormatDate = dateDB => {
  const d = new Date(standardizeDate(dateDB)).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return d;
};

const isSameDay = (date1, date2) => {
  const d1 = standardizeDate(date1);
  const d2 = standardizeDate(date2);
  return d1 === d2;
};

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

const statusColorMap = {
  [APPROVAL_REQUESTED]: 'red',
  [PENDING]: 'blackAlpha',
  [CHANGES_REQUESTED]: 'blue',
  [SCHEDULING]: 'blue',
  [SCHEDULED]: 'blue',
  [PICKED_UP]: 'blackAlpha',
  [RESCHEDULE]: 'orange',
};

const displayStatuses = {
  [APPROVAL_REQUESTED]: 'APPROVAL REQUESTED',
  [PENDING]: 'PENDING',
  [CHANGES_REQUESTED]: 'CHANGES REQUESTED',
  [SCHEDULING]: 'PENDING DONOR APPROVAL',
  [SCHEDULED]: 'AWAITING PICKUP',
  [PICKED_UP]: 'PICKUP COMPLETE',
  [RESCHEDULE]: 'RESCHEDULE',
};

const formatImageData = (data, numRowDisplay = 4) => {
  if (data.length < numRowDisplay) {
    return data.reduce((acc, curr) => {
      acc.push([curr]);
      return acc;
    }, []);
  }

  const res = data.reduce(
    (acc, curr) => {
      const lastGroup = acc[acc.length - 1];
      if (lastGroup.length < numRowDisplay) {
        lastGroup.push(curr);
      } else {
        acc.push([curr]);
      }
      return acc;
    },
    [[]],
  );

  const lastGroup = res[res.length - 1];

  const { length } = lastGroup;

  let { id } = lastGroup[length - 1];
  while (lastGroup.length % numRowDisplay !== 0) {
    id += 1;
    lastGroup.push({ imageURL: null, id });
  }

  return res;
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
  DELETE_DONATION: 'delete',
};

export {
  getDonationsFromDB,
  getRoutesFromDB,
  makeDate,
  routeFormatDate,
  isSameDay,
  formatImageData,
  formatFurnitureData,
  statusColorMap,
  displayStatuses,
  EMAIL_TYPE,
};

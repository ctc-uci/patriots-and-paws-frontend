const AUTH_ROLES = {
  SUPERADMIN_ROLE: 'superadmin',
  ADMIN_ROLE: 'admin',
  DRIVER_ROLE: 'driver',
};

// const EMAILSTATUSES = {
//   CANCEL_PICKUP: 'cancel pickup',
//   APPROVE: 'approve',
//   REQUEST_CHANGES: 'request changes',
//   SCHEDULED: 'scheduled',
// };

const STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CHANGES_REQUESTED: 'changes requested',
  SCHEDULING: 'scheduling',
  SCHEDULED: 'scheduled',
  ARCHIVED: 'archived',
};

export default { AUTH_ROLES, STATUSES };

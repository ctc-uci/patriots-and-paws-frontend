const AUTH_ROLES = {
  SUPERADMIN_ROLE: 'superadmin',
  ADMIN_ROLE: 'admin',
  DRIVER_ROLE: 'driver',
};

const STATUSES = {
  PENDING: 'pending',
  // APPROVAL_REQUESTED: 'approval requested',
  APPROVED: 'approved',
  CHANGES_REQUESTED: 'changes requested',
  SCHEDULING: 'scheduling',
  SCHEDULED: 'scheduled',
  PICKED_UP: 'picked up',
  RESCHEDULE: 'reschedule',
  // ARCHIVED: 'archived',
};

export { AUTH_ROLES, STATUSES };

/**
 * Workspace-Membership Enums
 */

export {
  MembershipRole,
  RoleHierarchy,
  isOwnerRole,
  isAdminOrOwner,
  canEditRole,
  canViewRole,
  compareRoles,
  canModifyRole,
  getRoleDisplayName,
  getRoleDescription,
} from './membership-role.enum';

export {
  MembershipStatus,
  isActiveMembership,
  isPendingMembership,
  canAccessWorkspace,
  isMembershipTerminated,
  canRestoreMembership,
  getMembershipStatusDisplayName,
  MembershipStatusTransitions,
  canTransitionMembershipStatus,
} from './membership-status.enum';

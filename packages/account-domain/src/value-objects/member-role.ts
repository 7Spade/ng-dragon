// MemberRole captures ACL roles bound to a membership under a workspace.
// Roles gate workspace access: owner > admin > member > viewer.
export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';

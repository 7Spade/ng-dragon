/**
 * Member role value object
 */
export type MemberRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
/**
 * Check if a given string is a valid member role
 */
export declare function isValidMemberRole(value: string): value is MemberRole;
/**
 * Check if a role has admin privileges
 */
export declare function hasAdminPrivileges(role: MemberRole): boolean;
/**
 * Check if a role can manage workspace
 */
export declare function canManageWorkspace(role: MemberRole): boolean;
/**
 * Get role hierarchy level (higher number = more privileges)
 */
export declare function getRoleLevel(role: MemberRole): number;
//# sourceMappingURL=member-role.d.ts.map
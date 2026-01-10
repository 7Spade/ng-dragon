/**
 * Member role value object
 */
/**
 * Check if a given string is a valid member role
 */
export function isValidMemberRole(value) {
    return ['owner', 'admin', 'manager', 'member', 'viewer'].includes(value);
}
/**
 * Check if a role has admin privileges
 */
export function hasAdminPrivileges(role) {
    return ['owner', 'admin', 'manager'].includes(role);
}
/**
 * Check if a role can manage workspace
 */
export function canManageWorkspace(role) {
    return ['owner', 'admin'].includes(role);
}
/**
 * Get role hierarchy level (higher number = more privileges)
 */
export function getRoleLevel(role) {
    switch (role) {
        case 'owner':
            return 5;
        case 'admin':
            return 4;
        case 'manager':
            return 3;
        case 'member':
            return 2;
        case 'viewer':
            return 1;
        default:
            return 0;
    }
}
//# sourceMappingURL=member-role.js.map
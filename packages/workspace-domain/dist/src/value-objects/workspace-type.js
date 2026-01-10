/**
 * Workspace type value object
 * Defines the different types of workspaces in the system
 */
/**
 * Check if a given string is a valid workspace type
 */
export function isValidWorkspaceType(value) {
    return ['personal', 'organization', 'team', 'partner', 'project'].includes(value);
}
/**
 * Get display label for workspace type
 */
export function getWorkspaceTypeLabel(type) {
    switch (type) {
        case 'personal':
            return 'Personal';
        case 'organization':
            return 'Organization';
        case 'team':
            return 'Team';
        case 'partner':
            return 'Partner';
        case 'project':
            return 'Project';
        default:
            return 'Workspace';
    }
}
/**
 * Get icon name for workspace type
 */
export function getWorkspaceTypeIcon(type) {
    switch (type) {
        case 'personal':
            return 'user';
        case 'organization':
            return 'apartment';
        case 'team':
            return 'team';
        case 'partner':
            return 'user-add';
        case 'project':
            return 'project';
        default:
            return 'appstore';
    }
}
//# sourceMappingURL=workspace-type.js.map